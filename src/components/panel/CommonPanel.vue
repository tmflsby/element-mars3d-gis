<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: () => ({})
  },
  tag: {
    type: String,
    default: 'el-card'
  }
})
</script>

<template>
  <component class="common-panel" v-if="visible" :is="tag" :style="style">
    <slot></slot>
  </component>
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
