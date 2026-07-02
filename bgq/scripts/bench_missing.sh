#!/usr/bin/env bash
# bench_missing.sh — benchmark `bgq missing subjects` for reference (name, type) pairs.
#
# Measures wall/user/sys time and peak RSS (bgq + duckdb child combined VmHWM)
# by polling /proc/<pid>/status every 50ms.
#
# Usage:
#   bash bgq/scripts/bench_missing.sh [runs] [bgq_binary] [db_path]
#
# Defaults: runs=3, bgq=./bin/bgq, db=./bangumi.db
# Output: tab-separated table to stdout. Also writes bench/bench_<label>.txt
# when run from bgq root.

set -euo pipefail

RUNS="${1:-3}"
BGQ="${2:-./bin/bgq}"
DB="${3:-./bangumi.db}"

if [[ ! -x "$BGQ" ]]; then
    echo "error: bgq binary not found at $BGQ" >&2
    exit 1
fi
if [[ ! -f "$DB" ]]; then
    echo "error: db not found at $DB" >&2
    exit 1
fi

# (name, type) reference pairs from the Phase 1 plan.
PAIRS=(
    "田澤智 2"
    "片貝稔 2"
    "川原砾 1"
)

OUTDIR="$(pwd)/bench"
mkdir -p "$OUTDIR"
LABEL="$(date +%Y%m%d_%H%M%S)"
OUTFILE="$OUTDIR/bench_${LABEL}.txt"

# Print header
{
    printf 'name\ttype\trun\twall_ms\tuser_ms\tsys_ms\tpeak_rss_kb\n'
} | tee "$OUTFILE"

# peak_rss_sampler <pid> <outvar>
# Polls /proc/<pid>/status VmHWM for the pid and its child duckdb process,
# writes the maximum combined RSS (in kB) to the named outvar.
peak_rss_sampler() {
    local parent_pid=$1
    local outvar=$2
    local max_rss=0
    while kill -0 "$parent_pid" 2>/dev/null; do
        # bgq process itself
        local bgq_rss=0
        if [[ -r "/proc/$parent_pid/status" ]]; then
            bgq_rss=$(awk '/^VmHWM:/ {print $2}' "/proc/$parent_pid/status" 2>/dev/null || echo 0)
        fi
        # find duckdb child(ren)
        local child_rss=0
        for cpid in $(pgrep -P "$parent_pid" 2>/dev/null || true); do
            if [[ -r "/proc/$cpid/status" ]]; then
                local r
                r=$(awk '/^VmHWM:/ {print $2}' "/proc/$cpid/status" 2>/dev/null || echo 0)
                if (( r > child_rss )); then
                    child_rss=$r
                fi
            fi
        done
        local total=$((bgq_rss + child_rss))
        if (( total > max_rss )); then
            max_rss=$total
        fi
        sleep 0.05
    done
    # final read after process exit may be unreliable; do one last pass while still alive above
    eval "$outvar=$max_rss"
}

run_one() {
    local name=$1
    local type=$2
    local run=$3
    # Time format: %e real | %U user | %S sys  (zsh `time` reserved word output is free-form;
    # use GNU bash `TIMEFORMAT` for parseable seconds.)
    local peak_rss=0
    local tmpout
    tmpout=$(mktemp)

    # Spawn bgq in a background subshell so we can poll its pid.
    (
        TIMEFORMAT='%R %U %S'
        { time "$BGQ" missing subjects "$name" --type "$type" --db "$DB" > "$tmpout" 2>&1; } 2>&1
    ) > /tmp/opencode/bench_time_$$  &
    local jobpid=$!

    peak_rss_sampler "$jobpid" peak_rss
    wait "$jobpid"
    local tline
    tline=$(cat /tmp/opencode/bench_time_$$)
    rm -f /tmp/opencode/bench_time_$$

    # parse "real user sys" (all in seconds, float)
    local real_s user_s sys_s
    read -r real_s user_s sys_s <<< "$tline"
    local wall_ms user_ms sys_ms
    wall_ms=$(awk -v x="$real_s" 'BEGIN{printf "%d", x*1000}')
    user_ms=$(awk -v x="$user_s" 'BEGIN{printf "%d", x*1000}')
    sys_ms=$(awk -v x="$sys_s" 'BEGIN{printf "%d", x*1000}')

    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
        "$name" "$type" "$run" "$wall_ms" "$user_ms" "$sys_ms" "$peak_rss" | tee -a "$OUTFILE"

    # summarize result count from tmpout
    local count
    count=$(grep -c '^  .* (id=' "$tmpout" 2>/dev/null || echo 0)
    printf '#   result rows: %s\n' "$count" | tee -a "$OUTFILE" >&2
    rm -f "$tmpout"
}

mkdir -p /tmp/opencode

for pair in "${PAIRS[@]}"; do
    read -r name type <<< "$pair"
    for run in $(seq 1 "$RUNS"); do
        run_one "$name" "$type" "$run"
    done
done

echo "" | tee -a "$OUTFILE"
echo "# full output written to $OUTFILE" | tee -a "$OUTFILE"
