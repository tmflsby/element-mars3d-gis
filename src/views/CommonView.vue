<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMapStore } from '@/stores/map'
import { usePanelStore } from '@/stores/panel'
import { useWPDStore } from '@/stores/wpd'

const panelComponent = {}
const files = import.meta.glob('../components/panel/*.vue', {
  eager: true
})

for (const key in files) {
  const filename = key.replace(/(\..\/components\/panel\/|\.(vue))/g, '')
  panelComponent[filename] = files[key].default || files[key]
}

const router = useRouter()
const panels = computed(() => router.currentRoute.value.meta.panels)

const mapStore = useMapStore()
const mapInitComplete = computed(() => mapStore.mapInitComplete)

const panelStore = usePanelStore()
const panelVisible = computed(() => panelStore.panelVisible)
const setPanelVisible = panelStore.setPanelVisible

const WPDStore = useWPDStore()
const WPDInitComplete = computed(() => WPDStore.WPDInitComplete)

const addLayerTreeControl = () => {
  const layerTreeControl = new window.mars3d.control.ToolButton({
    title: '图层管理',
    icon: 'fa fa-tasks',
    insertIndex: 1, //插入的位置顺序, 1是home按钮后面
    click: () => {
      setPanelVisible('LayerTreePanelVisible', !panelVisible.value.LayerTreePanelVisible)
    }
  })
  window.map.addControl(layerTreeControl)
}

watch(
  () => mapInitComplete.value,
  () => {
    if (mapInitComplete.value) {
      for (let i = 0; i < panels.value.length; i++) {
        // console.log('panels.value[i]', panels.value[i])
        setPanelVisible(`${panels.value[i].name}Visible`, panels.value[i].visible)
        if (panels.value[i].name === 'LayerTreePanel') {
          addLayerTreeControl()
        }
      }
    }
  }
)

watch(
  () => router.currentRoute.value,
  () => {
    for (let i = 0; i < panels.value.length; i++) {
      setPanelVisible(`${panels.value[i].name}Visible`, panels.value[i].visible)
    }
  }
)
</script>

<template>
  <div class="common-view w-100% h-100%">
    <template v-for="(panel, panelKey) in panels" :key="panelKey">
      <el-card
        v-if="panel.renderAfterMapInitComplete ? mapInitComplete : WPDInitComplete"
        v-show="panelVisible[`${panel.name}Visible`]"
        :class="['panel-wrapper', panel.class]"
        :style="panel.style"
        :bodyClass="'w-100% h-100%'"
        :bodyStyle="{
          padding: 0
        }"
      >
        <component
          :is="panelComponent[panel.component]"
          :class="panel.widget.class"
          :style="panel.widget.style"
          :subWidgets="panel.widget.subWidgets"
        ></component>
      </el-card>
    </template>
  </div>
</template>
