<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMapStore } from '@/stores/map'
import { usePanelStore } from '@/stores/panel'

const panelComponent = {}
const files = import.meta.globEager('../components/panel/*.vue')

for (const key in files) {
  const filename = key.replace(/(\..\/components\/panel\/|\.(vue))/g, '')
  panelComponent[filename] = files[key].default || files[key]
}

const router = useRouter()
const routerPanel = computed(() => router.currentRoute.value.meta.panel)

const mapStore = useMapStore()
const mapInitComplete = computed(() => mapStore.mapInitComplete)

const panelStore = usePanelStore()
const panelVisible = computed(() => panelStore.panelVisible)
const setPanelVisible = panelStore.setPanelVisible

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
      for (let i = 0; i < routerPanel.value.length; i++) {
        // console.log('routerPanel.value[i]', routerPanel.value[i])
        setPanelVisible(`${routerPanel.value[i].name}Visible`, routerPanel.value[i].visible)
        if (routerPanel.value[i].name === 'LayerTreePanel') {
          addLayerTreeControl()
        }
      }
    }
  }
)

watch(
  () => router.currentRoute.value,
  () => {
    for (let i = 0; i < routerPanel.value.length; i++) {
      // console.log('routerPanel.value[i]', routerPanel.value[i])
      setPanelVisible(`${routerPanel.value[i].name}Visible`, routerPanel.value[i].visible)
    }
  }
)
</script>

<template>
  <div class="common-view" v-if="mapInitComplete">
    <template v-for="(panel, panelKey) in routerPanel" :key="panelKey">
      <component
        :is="panelComponent['CommonPanel']"
        :visible="panelVisible[`${panel.name}Visible`]"
        :style="panel.style"
        :tag="panel.tag"
        v-draggable="panel.draggable"
      >
        <component :is="panelComponent[panel.component]" :props="panel.props"></component>
      </component>
    </template>
  </div>
</template>

<style scoped></style>
