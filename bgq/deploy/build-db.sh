#!/bin/bash
# 构建 bangumi_web.db
set -e
cd "$(dirname "$0")/.."

DUCKDB="${DUCKDB:-./bin/duckdb}"
DATA_DIR="${DATA_DIR:-$(cd .. && pwd)/bangumi_archive}"
OUTPUT="${1:-deploy/bangumi_web.db}"

echo "数据目录: $DATA_DIR"
echo "输出: $OUTPUT"
echo "构建中..."

cat > /tmp/build_web_db.sql << 'ENDSQL'
CREATE TABLE subjects AS
  SELECT id, type, name, name_cn, infobox, platform,
         nsfw, score, rank, date, series, tags, meta_tags
  FROM read_json_auto('DATA_DIR/subject.jsonlines', format='newline_delimited');
CREATE TABLE subject_relations AS
  SELECT subject_id, relation_type, related_subject_id, "order"
  FROM read_json_auto('DATA_DIR/subject-relations.jsonlines', format='newline_delimited');
CREATE TABLE subject_persons AS
  SELECT person_id, subject_id, "position", appear_eps
  FROM read_json_auto('DATA_DIR/subject-persons.jsonlines', format='newline_delimited');
CREATE TABLE episodes AS
  SELECT id, name, name_cn, airdate, disc, duration, subject_id, sort, type
  FROM read_json_auto('DATA_DIR/episode.jsonlines', format='newline_delimited');
CREATE INDEX idx_sub_type ON subjects(type);
CREATE INDEX idx_sub_score ON subjects(score);
CREATE INDEX idx_rel_subject ON subject_relations(subject_id);
CREATE INDEX idx_ep_subject ON episodes(subject_id);
CREATE INDEX idx_per_subject ON subject_persons(subject_id);
ENDSQL

sed -i "s|DATA_DIR|${DATA_DIR}|g" /tmp/build_web_db.sql
"${DUCKDB}" "${OUTPUT}" -f /tmp/build_web_db.sql
echo "完成: $(du -h "${OUTPUT}" | cut -f1)"
