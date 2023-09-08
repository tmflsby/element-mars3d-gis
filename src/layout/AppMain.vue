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
const changeWPDInitComplete = WPDStore.changeWPDInitComplete

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

  // 自定义图层都放着window.CustomLayer下
  window.CustomLayer = {}

  const cesiumViewerToolbar = document.getElementsByClassName('cesium-viewer-toolbar')[0]
  const mars3dCompass = document.getElementsByClassName('mars3d-compass')[0]
  // console.log('cesiumViewerToolbar', cesiumViewerToolbar)
  cesiumViewerToolbar.style.display = 'none'
  mars3dCompass.style.display = 'none'

  // 用户信息，行政区划  提前获取
  window.WPD = new Map()

  await getSystemUserInfo()
  await getWPDData(['WPAdministrativeArea', 'WPMonitoringPoints'])
  await getCurrentWPAdministrativeArea()

  // 蒙版
  const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.value.code)
  await mars3dLayer.maskLayer(region.level, region.id)

  changeMapInitComplete(true)

  cesiumViewerToolbar.style.display = 'block'
  mars3dCompass.style.display = 'block'

  await defaultShowLayers()

  // 水库
  await getWPDData(['WPStationRR'])
  mars3dLayer.initWPStationRRIcon()

  // 水文站
  await getWPDData(['WPStationZQ'])
  mars3dLayer.initWPStationZQIcon()

  // 水位站
  await getWPDData(['WPStationZZ'])
  mars3dLayer.initWPStationZZIcon()

  // 雨量站
  await getWPDData(['WPStationPP'])
  mars3dLayer.initWPStationPPIcon()

  await getWPDData(['WPStationHP', 'WPSluice', 'WPStationPump', 'EasilyFloodedArea', 'WPRiver'])

  // 水电站
  mars3dLayer.initWPStationHPIcon()

  // 水闸
  mars3dLayer.initWPSluiceIcon()

  // 泵站
  mars3dLayer.initWPStationPumpIcon()

  // 易淹区水位计
  mars3dLayer.initEasilyFloodedAreaIcon()

  // 水系增加popup
  mars3dLayer.addWPRiverPopup()

  // 泵站
  await getWPDData(['WPembankment'])

  changeWPDInitComplete(true)
})

const initMars3d = (option) => {
  window.map = new window.mars3d.Map('mars3dContainer', option)
  window.map.openFlyAnimation()
}

const defaultShowLayers = () => {
  // 默认打开 水系，水库面，蒙版，行政区划，水库，水文站，水位站，雨量站
  const defaultShowLayersArr = [2003, 2004, 3001, 3002, 4001, 4002, 4003, 4004]
  for (let i = 0; i < window.map.options.layers.length; i++) {
    const layer = window.map.getLayer(window.map.options.layers[i].id)
    layer.show = defaultShowLayersArr.includes(layer.id)
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
