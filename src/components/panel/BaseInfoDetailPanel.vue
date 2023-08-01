<script setup>
defineProps({
  props: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <div class="base-info-detail-panel" :style="props.style">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
