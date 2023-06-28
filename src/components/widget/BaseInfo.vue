<script setup>
import { ref, onBeforeMount } from 'vue'
import { river_getRiverByAdministrativeArea } from '@/api/river'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const userInfo = systemStore.userInfo

const baseInfo = ref('')

onBeforeMount(async () => {
  const region = window.WPD.get('WPAdministrativeArea').get(userInfo.dept.code)
  if (region.level === 'CITY') {
    baseInfo.value =
      '三明市内河众多，流域面积50km²以上的173条，500-1000km²的7条、1001-5000km²的5条，5000km²以上的3条。分属浙闽台诸河的闽江水系、福建沿海诸河、长江流域的鄱阳湖水系；珠江流域的韩江水系。河流特点是坡降大、水量充沛、上中游河床切割较深，水流急，含沙量较少。主要三大河流分别是沙溪、金溪和尤溪。'
  } else {
    const getRiverByAdministrativeAreaRes = await river_getRiverByAdministrativeArea({
      projectId,
      AdministrativeAreaId: region.id,
      AdministrativeAreaType: region.level
    })
    // console.log(getRiverByAdministrativeAreaRes)
    const riverNum = getRiverByAdministrativeAreaRes.data.length
    const riverNames = getRiverByAdministrativeAreaRes.data.map((item) => item.name).join('、')
    if (getRiverByAdministrativeAreaRes.state === 0) {
      baseInfo.value = `三明市${region.name}水网密布、河流众多，水资源十分丰富。共有${riverNum}条主要河流，包括：${riverNames}等。`
    }
  }
})
</script>

<template>
  <el-text class="base-info">{{ baseInfo }}</el-text>
</template>

<style scoped>
.base-info {
  font-size: 14px;
  line-height: 24px;
  display: block;
  text-indent: 2em;
}
</style>
