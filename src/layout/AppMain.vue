<script setup>
import { watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cantonManage_queryObjectInfos } from '@/api/cantonManage'
import { useSystemStore } from '@/stores/system'
import { useMapStore } from '@/stores/map'
import { useWPDStore } from '@/stores/wpd'
import mars3dLayer from '@/utils/mars3dLayer'

const router = useRouter()

const systemStore = useSystemStore()
const selectedRegion = computed(() => systemStore.selectedRegion)

const mapStore = useMapStore()
const changeMapInitComplete = mapStore.changeMapInitComplete

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId
const getWPDData = WPDStore.getWPDData
const changeWPDInitComplete = WPDStore.changeWPDInitComplete

const getCurrentWPAdministrativeArea = async () => {
  const queryObjectInfosRes = await cantonManage_queryObjectInfos({
    projectId,
    cantonId: selectedRegion.value.id
  })
  if (queryObjectInfosRes.state === 0) {
    window.WPD.get('WPAdministrativeArea').set(selectedRegion.value.id, {
      ...selectedRegion.value,
      ...queryObjectInfosRes.data
    })
  }
}

onMounted(async () => {
  // 获取地图配置
  const mapOptions = await window.mars3d.Util.fetchJson({ url: '/config/mapOptions.json' })
  // 初始化地图
  window.map = new window.mars3d.Map('mars3dContainer', mapOptions)
  // 开始飞行动画
  window.map.openFlyAnimation()

  // 自定义图层都放着window.CustomLayer下
  window.CustomLayer = {}

  // 用户信息，行政区划  提前获取
  window.WPD = new Map()

  // 获取WPD数据
  await getWPDData([
    'WPAdministrativeArea',
    'WPMonitoringPoints',
    'WPStationRR',
    'WPStationZQ',
    'WPStationZZ',
    'WPStationPP',
    'WPStationHP',
    'WPSluice',
    'WPStationPump',
    'EasilyFloodedArea',
    'WPRiver',
    'WPembankment'
  ])

  changeWPDInitComplete(true)

  // 获取当前行政区划信息
  await getCurrentWPAdministrativeArea()

  // 蒙版
  mars3dLayer.maskLayer(selectedRegion.value.level, selectedRegion.value.id)

  changeMapInitComplete(true)

  defaultShowLayers()

  // 水库
  mars3dLayer.initWPStationRRIcon()

  // 水文站
  mars3dLayer.initWPStationZQIcon()

  // 水位站
  mars3dLayer.initWPStationZZIcon()

  // 雨量站
  mars3dLayer.initWPStationPPIcon()

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
})

const defaultShowLayers = () => {
  // 默认打开 水系，水库面，行政区划，水库，水文站，水位站，雨量站
  const defaultShowLayersArr = [2003, 2004, 3002, 4001, 4002, 4003, 4004]
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
  <div class="w-100% h-100%">
    <div id="mars3dContainer" class="w-100% h-100%" />
  </div>
</template>
