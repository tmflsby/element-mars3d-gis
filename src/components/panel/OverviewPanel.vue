<script setup>
const widgetComponent = {}
const files = import.meta.globEager('../widget/*.vue')
for (const key in files) {
  const filename = key.replace(/(\..\/widget\/|\.(vue))/g, '')
  widgetComponent[filename] = files[key].default || files[key]
}

defineProps({
  props: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <div class="overview-panel" :style="props.style">
    <el-card
      class="sub-container"
      v-for="(container, index) in props.subContainer"
      :key="index"
      :style="container.style"
    >
      <template #header>
        <div class="title">
          <span>{{ container.title }}</span>
          <el-button size="small" v-if="container.detailBtn.show">
            {{ container.detailBtn.title }}
          </el-button>
        </div>
      </template>
      <div class="content">
        <component :is="widgetComponent[container.component]"></component>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.overview-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-card__header) {
    width: 100%;
    height: 50px;
    padding: 0;
  }
  :deep(.el-card__body) {
    width: 100%;
    height: calc(100% - 50px);
    padding: 0;
  }
  .sub-container {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
    .content {
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
