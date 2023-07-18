<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { river_getRiverByAdministrativeArea } from '@/api/river'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept

const infoText = ref('')
const infoStatistic = reactive([])
const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.code)

const getInfoText = async () => {
  if (region.level === 'CITY') {
    infoText.value =
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
      infoText.value = `三明市${region.name}水网密布、河流众多，水资源十分丰富。共有${riverNum}条主要河流，包括：${riverNames}等。`
    }
  }
}

const getInfoStatistic = async () => {
  infoStatistic.push(
    ...[
      { name: '总人口', id: 'totalPopulation', value: region.totalPopulation },
      { name: '总户数', id: 'totalHousehold', value: region.totalHousehold },
      { name: '土地面积', id: 'landArea', value: region.landArea },
      { name: '耕地面积', id: 'cultivatedArea', value: region.cultivatedArea }
    ]
  )
  switch (region.level) {
    case 'CITY':
      infoStatistic.push({ name: '县市数', id: 'countyNum', value: region.countyNum })
      infoStatistic.push({ name: '乡镇数', id: 'townshipNum', value: region.townshipNum })
      infoStatistic.push({ name: '村庄数', id: 'villageNum', value: region.villageNum })
      break
    case 'COUNTY':
      infoStatistic.push({ name: '乡镇数', id: 'townshipNum', value: region.townshipNum })
      infoStatistic.push({ name: '村庄数', id: 'villageNum', value: region.villageNum })
      break
    case 'TOWNSHIP':
      infoStatistic.push({ name: '村庄数', id: 'villageNum', value: region.villageNum })
      break
  }
}

onBeforeMount(() => {
  getInfoText()
  getInfoStatistic()
})
</script>

<template>
  <div class="base-info">
    <div class="text-content">
      <el-input type="textarea" resize="none" v-model="infoText" />
    </div>
    <div class="statistic-content">
      <el-card class="statistic-content-item" v-for="item in infoStatistic" :key="item.id">
        <div class="statistic-content-item-name">{{ item.name }}</div>
        <div class="statistic-content-item-value">{{ item.value }}</div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-info {
  width: 100%;
  height: 100%;
  .text-content {
    width: 100%;
    height: calc(100% - 150px);
    :deep(.el-textarea) {
      width: 100%;
      height: 100%;
      .el-textarea__inner {
        height: 100%;
      }
    }
  }
  .statistic-content {
    width: 100%;
    height: 140px;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .statistic-content-item {
      width: 45%;
      height: 30px;
      :deep(.el-card__body) {
        width: 100%;
        height: 100%;
        padding: 0 5px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
