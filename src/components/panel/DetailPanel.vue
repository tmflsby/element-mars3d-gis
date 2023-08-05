<script setup>
import { usePanelStore } from '@/stores/panel'

defineProps({
  props: {
    type: Object,
    default: () => ({})
  }
})

const panelStore = usePanelStore()
const setPanelVisible = panelStore.setPanelVisible

const widgetComponent = {}
const files = import.meta.globEager('../widget/*.vue')
for (const key in files) {
  const filename = key.replace(/(\..\/widget\/|\.(vue))/g, '')
  widgetComponent[filename] = files[key].default || files[key]
}

const handleClickBackBtn = (component) => {
  setPanelVisible(`${component}Visible`, false)
}
</script>

<template>
  <div class="base-info-detail-panel" :style="props.style">
    <el-card class="sub-container">
      <template #header>
        <div class="title">
          <span>{{ props.title }}</span>
          <i
            class="fa fa-mail-reply"
            aria-hidden="true"
            @click="handleClickBackBtn(props.component)"
          />
        </div>
      </template>
      <div class="content">
        <!--        <component :is="widgetComponent['BaseInfoDetailWidget']"></component>-->
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.base-info-detail-panel {
  width: 100%;
  height: 100%;
  .sub-container {
    width: 100%;
    height: 100%;
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
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      .fa-mail-reply {
        font-size: 20px;
        cursor: pointer;
      }
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
