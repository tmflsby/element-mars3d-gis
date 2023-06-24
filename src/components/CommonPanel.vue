<script setup>
import { defineProps } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <el-card class="common-panel" v-if="visible" :style="style">
    <slot></slot>
  </el-card>
</template>

<style scoped lang="scss">
.common-panel {
  :deep(.el-card__body) {
    width: 100%;
    height: 100%;
    padding: 0;
  }
}
</style>
