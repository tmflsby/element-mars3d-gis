<script setup>
import { watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system'
import { useMapStore } from '@/stores/map'
import { useWPDStore } from '@/stores/wpd'
import { project_queryobjects } from '@/api/project'
import { system_user_info } from '@/api/user'
import mars3dLayer from '@/utils/mars3dLayer'

const router = useRouter()

const systemStore = useSystemStore()
const setUserInfo = systemStore.setUserInfo
const userInfo = computed(() => systemStore.userInfo)

const mapStore = useMapStore()
const changeMapInitComplete = mapStore.changeMapInitComplete

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId
const WPStationRR_topoId = WPDStore.WPStationRR_topoId
const WPStationZQ_topoId = WPDStore.WPStationZQ_topoId
const WPStationZZ_topoId = WPDStore.WPStationZZ_topoId
const WPStationPP_topoId = WPDStore.WPStationPP_topoId
const WPStationHP_topoId = WPDStore.WPStationHP_topoId
const WPMonitoringPoints_topoId = WPDStore.WPMonitoringPoints_topoId
const WPSluice_topoId = WPDStore.WPSluice_topoId
const WPembankment_topoId = WPDStore.WPembankment_topoId
const WPStationPump_topoId = WPDStore.WPStationPump_topoId
const EasilyFloodedArea_topoId = WPDStore.EasilyFloodedArea_topoId
const WPAdministrativeArea_topoId = WPDStore.WPAdministrativeArea_topoId

const getSystemUserInfo = async () => {
  const res = await system_user_info()
  if (res.code === 0) {
    setUserInfo(res.data)
  }
}
const getWPDData = async (WPDObjectArr) => {
  for (let i = 0; i < WPDObjectArr.length; i++) {
    const getStationRes = await project_queryobjects({
      projectId,
      topoId: WPDObjectArr[i].topoId
    })
    if (getStationRes.state === 0) {
      for (let j = 0; j < getStationRes?.data?.data.length; j++) {
        saveWPDData({
          type: WPDObjectArr[i].type,
          data: getStationRes?.data?.data[j]
        })
      }
    }
  }
}

const saveWPDData = ({ type, data }) => {
  let stationId
  if (type === 'WPMonitoringPoints') {
    stationId = data.ORDER_INDEX
  } else if (type === 'EasilyFloodedArea') {
    stationId = data.deviceAddr
  } else {
    stationId = data.id
  }
  if (window.WPD.has(type)) {
    window.WPD.get(type).set(stationId, data)
  } else {
    window.WPD.set(type, new Map())
    window.WPD.get(type).set(stationId, data)
  }
}

onMounted(async () => {
  const mapOptions = await window.mars3d.Util.fetchJson({ url: '/config/mapOptions.json' })
  await initMars3d(mapOptions)

  // 用户信息，行政区划  提前获取
  window.WPD = new Map()
  await getSystemUserInfo()
  await getWPDData([{ type: 'WPAdministrativeArea', topoId: WPAdministrativeArea_topoId }])

  changeMapInitComplete(true)

  await defaultShowLayers()

  await getWPDData([
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
  ])

  const region = window.WPD.get('WPAdministrativeArea').get(userInfo.value.dept.code)
  // 2004蒙版
  await mars3dLayer.maskLayer(region.level, region.id)
})

const initMars3d = (option) => {
  window.map = new window.mars3d.Map('mars3dContainer', option)
  window.map.openFlyAnimation()
}

const defaultShowLayers = () => {
  // 默认打开蒙版，行政区划，水系，水库面（200301, 200302, 2004）
  const defaultShowLayersArr = [200301, 200302, 2004, 2005]
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
