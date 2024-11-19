<script setup>
import { computed } from 'vue'
import { usePanelStore } from '@/stores/panel'
import { useWPDStore } from '@/stores/wpd'

const panelStore = usePanelStore()
const panelVisible = computed(() => panelStore.panelVisible)
const setPanelVisible = panelStore.setPanelVisible

const WPDStore = useWPDStore()
const WPDInitComplete = computed(() => WPDStore.WPDInitComplete)

const widgetComponent = {}
const files = import.meta.glob('../widget/*.vue', {
  eager: true
})
for (const key in files) {
  const filename = key.replace(/(\..\/widget\/|\.(vue))/g, '')
  widgetComponent[filename] = files[key].default || files[key]
}

defineProps({
  subWidgets: {
    type: Array,
    default: () => []
  }
})

const handleClickDetailBtn = (item) => {
  // console.log('item', item)
  setPanelVisible(
    `${item.showComponent}Visible`,
    !panelVisible.value[`${item.showComponent}Visible`]
  )
}
</script>

<template>
  <div class="overview-panel">
    <el-card
      v-for="(widget, index) in subWidgets"
      :key="index"
      :class="widget.class"
      :style="widget.style"
      :bodyStyle="{
        padding: 0,
        width: '100%',
        height: 'calc(100% - 50px)'
      }"
    >
      <template #header>
        <div class="flex-bc w-100% h100% p-10px box-border">
          <span>{{ widget.title }}</span>
          <template v-for="(item, index) in widget.detailBtn" :key="index">
            <el-button
              size="small"
              v-if="item.show"
              :disabled="!WPDInitComplete"
              @click="handleClickDetailBtn(item)"
            >
              {{ item.title }}
            </el-button>
          </template>
        </div>
      </template>
      <div class="w-100% h-100% p-10px box-border">
        <component :is="widgetComponent[widget.component]"></component>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.overview-panel {
  :deep(.el-card__header) {
    width: 100%;
    height: 50px;
    padding: 0;
  }
}
</style>
