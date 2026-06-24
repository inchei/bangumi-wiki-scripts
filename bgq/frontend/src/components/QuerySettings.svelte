<script>
  import {
    getFiltersForAPI,
    queryTarget,
    lastResult,
    queryLoading,
  } from "../stores.js";
  import { runQuery } from "../api.js";
  import { get } from "svelte/store";

  let loading = $state(false);

  async function handleRun() {
    loading = true;
    queryLoading.set(true);
    lastResult.set(null);
    const cols =
      document
        .getElementById("outputColumns")
        ?.value.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];
    const limit =
      parseInt(document.getElementById("resultLimit")?.value) || 500;
    try {
      const data = await runQuery(
        getFiltersForAPI(),
        cols,
        get(queryTarget),
        limit,
      );
      lastResult.set(data);
    } catch (e) {
      lastResult.set({ error: e.message });
    } finally {
      loading = false;
      queryLoading.set(false);
    }
  }
</script>

<div class="card">
  <div class="card-header"><span class="dot-indicator"></span>输出设置</div>
  <div class="form-group">
    <label class="form-label" for="outputColumns">输出列（逗号分隔）</label>
    <input
      class="input"
      id="outputColumns"
      value="id,name,name_cn,type,score"
      placeholder="id,name,score,出版社"
    />
  </div>
  <div class="form-group">
    <label class="form-label" for="resultLimit">结果数量上限</label>
    <input
      class="input"
      id="resultLimit"
      value="500"
      type="number"
      min="1"
      max="10000"
      style="width:120px"
    />
  </div>
  <button
    class="btn btn-primary btn-block"
    onclick={handleRun}
    disabled={loading}
    style="height:42px;font-size:15px"
  >
    {loading ? "查询中..." : "▶ 执行查询"}
  </button>
</div>
