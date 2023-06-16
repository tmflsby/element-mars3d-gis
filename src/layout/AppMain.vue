<script setup>
import { ref, watch, onMounted, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { project_queryobjects } from '@/api/project'
import { useSystemStore } from '@/stores/system'
import { useStationStore } from '@/stores/station'
import { useMapStore } from '@/stores/map'

const router = useRouter()
const systemStore = useSystemStore()
const projectId = systemStore.projectId
const WPStationRR_topoId = systemStore.WPStationRR_topoId
const WPStationZQ_topoId = systemStore.WPStationZQ_topoId
const WPStationZZ_topoId = systemStore.WPStationZZ_topoId
const WPStationPP_topoId = systemStore.WPStationPP_topoId
const WPStationHP_topoId = systemStore.WPStationHP_topoId
const WPMonitoringPoints_topoId = systemStore.WPMonitoringPoints_topoId
const WPSluice_topoId = systemStore.WPSluice_topoId
const WPembankment_topoId = systemStore.WPembankment_topoId
const WPStationPump_topoId = systemStore.WPStationPump_topoId
const EasilyFloodedArea_topoId = systemStore.EasilyFloodedArea_topoId

const stationStore = useStationStore()
const addStationToMap = stationStore.addStationToMap

const mapStore = useMapStore()
const changeMapInitComplete = mapStore.changeMapInitComplete

// 請求站點數據
onBeforeMount(async () => {
  const stationArr = [
    { type: 'WPStationRR', topoId: WPStationRR_topoId },
    { type: 'WPStationZQ', topoId: WPStationZQ_topoId },
    { type: 'WPStationZZ', topoId: WPStationZZ_topoId },
    { type: 'WPStationPP', topoId: WPStationPP_topoId },
    { type: 'WPStationHP', topoId: WPStationHP_topoId },
    { type: 'WPMonitoringPoints', topoId: WPMonitoringPoints_topoId },
    { type: 'WPSluice', topoId: WPSluice_topoId },
    { type: 'WPembankment', topoId: WPembankment_topoId },
    { type: 'WPStationPump', topoId: WPStationPump_topoId },
    { type: 'EasilyFloodedArea', topoId: EasilyFloodedArea_topoId }
  ]

  for (let i = 0; i < stationArr.length; i++) {
    const getStationRes = await project_queryobjects({
      projectId,
      topoId: stationArr[i].topoId
    })
    if (getStationRes.state === 0) {
      for (let j = 0; j < getStationRes?.data?.data.length; j++) {
        addStationToMap({
          type: stationArr[i].type,
          station: getStationRes?.data?.data[j]
        })
      }
    }
  }
})

onMounted(async () => {
  const mapOptions = await window.mars3d.Util.fetchJson({ url: '/config/mapOptions.json' })
  initMars3d(mapOptions)
  defaultShowLayers()
})

const initMars3d = (option) => {
  window.map = new window.mars3d.Map('mars3dContainer', option)
  window.map.openFlyAnimation()
  changeMapInitComplete(true)
}

const defaultShowLayers = () => {
  // 默认打开行政区划，水系，蒙版（200301, 200302, 2004）
  const defaultShowLayersArr = [200301, 200302, 2004]
  for (let i = 0; i < window.map.options.layers.length; i++) {
    const layer = window.map.getLayer(window.map.options.layers[i].id)
    if (defaultShowLayersArr.includes(layer.id)) {
      if (!layer.isAdded) {
        window.map.addLayer(layer)
      }
      layer.show = true
    } else {
      if (layer.isAdded) {
        window.map.removeLayer(layer)
      }
      layer.show = false
    }
  }
}
// 监听路由变化，切换地图
watch(
  () => router.currentRoute.value,
  () => {
    defaultShowLayers()
  }
)
</script>

<template>
  <div class="app-main">
    <div id="mars3dContainer" class="mars3d-container" />
  </div>
</template>

<style scoped>
.app-main {
  width: 100%;
  height: 100%;
  .mars3d-container {
    width: 100%;
    height: 100%;
  }
}
</style>
