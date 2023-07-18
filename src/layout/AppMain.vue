<script setup>
import { watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { system_user_info } from '@/api/user'
import { cantonManage_queryObjectInfos } from '@/api/cantonManage'
import { useSystemStore } from '@/stores/system'
import { useMapStore } from '@/stores/map'
import { useWPDStore } from '@/stores/wpd'
import mars3dLayer from '@/utils/mars3dLayer'

const router = useRouter()

const systemStore = useSystemStore()
const setUserInfo = systemStore.setUserInfo
const selectedDept = computed(() => systemStore.selectedDept)

const mapStore = useMapStore()
const changeMapInitComplete = mapStore.changeMapInitComplete

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId
const getWPDData = WPDStore.getWPDData

const getSystemUserInfo = async () => {
  const userInfoRes = await system_user_info()
  if (userInfoRes.code === 0) {
    setUserInfo(userInfoRes.data)
  }
}

const getCurrentWPAdministrativeArea = async () => {
  const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.value.code)
  const queryObjectInfosRes = await cantonManage_queryObjectInfos({
    projectId,
    cantonId: region.id
  })
  if (queryObjectInfosRes.state === 0) {
    window.WPD.get('WPAdministrativeArea').set(region.id, {
      ...region,
      ...queryObjectInfosRes.data
    })
  }
}

onMounted(async () => {
  const mapOptions = await window.mars3d.Util.fetchJson({ url: '/config/mapOptions.json' })
  await initMars3d(mapOptions)

  // 用户信息，行政区划  提前获取
  window.WPD = new Map()
  await getSystemUserInfo()
  await getWPDData(['WPAdministrativeArea', 'WPMonitoringPoints'])
  await getCurrentWPAdministrativeArea()

  const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.value.code)
  // 2004蒙版
  await mars3dLayer.maskLayer(region.level, region.id)

  changeMapInitComplete(true)

  await defaultShowLayers()

  await getWPDData([
    'WPStationRR',
    'WPStationZQ',
    'WPStationZZ',
    'WPStationPP',
    'WPStationHP',
    'WPSluice',
    'WPembankment',
    'WPStationPump',
    'EasilyFloodedArea'
  ])
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
