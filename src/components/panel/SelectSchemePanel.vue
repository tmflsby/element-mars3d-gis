<script setup>
defineProps({
  props: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <div class="select-scheme-panel" :style="props.style">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>选择方案</span>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.select-scheme-panel {
  width: 100%;
  height: 100%;
  :deep(.el-card) {
    width: 100%;
    height: 100%;
    .el-card__header {
      width: 100%;
      height: 50px;
      padding: 10px;
      box-sizing: border-box;
      .card-header {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
    .el-card__body {
      width: 100%;
      height: calc(100% - 50px);
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
