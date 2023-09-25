<script setup>
import dayjs from 'dayjs'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onBeforeMount, watch } from 'vue'
import {
  magnitudeRain_getHistoryRainMonitorSegment,
  magnitudeRain_getGradingSiteInfo,
  magnitudeRain_getArbitrarilyRainMonitorByArea
} from '@/api/magnitudeRain'
import { formatStation } from '@/utils/format'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept
const refreshTime = systemStore.refreshTime

const WPAdministrativeArea = window.WPD.get('WPAdministrativeArea')
const selectedRegion = WPAdministrativeArea.get(selectedDept.code)
const cityRegion = reactive([])
const countyRegion = reactive([])
const townshipRegion = reactive([])
WPAdministrativeArea.forEach((region) => {
  if (region.level === 'CITY') {
    cityRegion.push(region)
  } else if (region.level === 'COUNTY') {
    countyRegion.push(region)
  } else if (region.level === 'TOWNSHIP') {
    townshipRegion.push(region)
  }
})

const allRegion = reactive([...cityRegion, ...countyRegion, ...townshipRegion])
const allRegionSelectedValue = ref(selectedRegion.id)

const statisticTypeOptions = reactive(['分时段统计', '最大雨量统计', '详细查询'])
const currentStatisticType = ref('分时段统计')
const timeStatisticTopTableData = ref([])
const timeStatisticTopTableColumn = reactive([
  { prop: 'stnm', label: '站名', sortable: false, width: 150, fixed: 'left' },
  { prop: 'drpOneH', label: '1h', sortable: true, width: 100 },
  { prop: 'drpThreeH', label: '3h', sortable: true, width: 100 },
  { prop: 'drpSixH', label: '6h', sortable: true, width: 100 },
  { prop: 'drpTwelveH', label: '12h', sortable: true, width: 100 },
  { prop: 'drpTwentyFourH', label: '24h', sortable: true, width: 100 }
])
const detailedQueryTableData = ref({})
const detailedQueryTableColumn = reactive([
  {
    prop: 'sttp',
    label: '类型',
    sortable: true,
    formatter: (row, column, cellValue) => {
      return formatStation(cellValue)
    }
  },
  { prop: 'stnm', label: '站点', sortable: false },
  { prop: 'drp', label: '雨量', sortable: true }
])
const oneHourTableData = ref([])
const threeHourTableData = ref([])
const maxRainfallTableColumn = reactive([
  { prop: 'name', label: '站名', sortable: false, width: 150, fixed: 'left' },
  { prop: 'administrativeArea', label: '地区', sortable: true, width: 100 },
  { prop: 'sum', label: '雨量', sortable: true, width: 100 },
  { prop: 'intervalTime', label: '时间', sortable: true, width: 150 }
])

const selectTimeOptions = reactive([
  { label: '近1小时', value: 1 },
  { label: '近3小时', value: 3 },
  { label: '近6小时', value: 6 },
  { label: '近12小时', value: 12 },
  { label: '近24小时', value: 24 },
  { label: '近48小时', value: 48 }
])
const selectedTimeValue = ref([
  dayjs(refreshTime).subtract(24, 'h').toDate(),
  dayjs(refreshTime).toDate()
])
const shortcuts = []

for (let i = 0; i < selectTimeOptions.length; i++) {
  shortcuts.push({
    text: selectTimeOptions[i].label,
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * selectTimeOptions[i].value)
      return [start, end]
    }
  })
}

const rainfallLevelOptions = reactive([
  { label: '0-10mm', value: 'more0List' },
  { label: '10-25mm', value: 'more10List' },
  { label: '25-50mm', value: 'more25List' },
  { label: '50-100mm', value: 'more50List' },
  { label: '100-250mm', value: 'more100List' },
  { label: '250mm以上', value: 'more250List' }
])
const selectedRainfallLevelValue = ref('more50List')

const handleClickStatisticTypeBtn = (statisticType) => {
  currentStatisticType.value = statisticType
}

const getHistoryRainMonitorSegment = async () => {
  const region = WPAdministrativeArea.get(allRegionSelectedValue.value)
  const getHistoryRainMonitorSegmentRes = await magnitudeRain_getHistoryRainMonitorSegment({
    projectId,
    areaId: region.id,
    type: region.level,
    time: dayjs(refreshTime).format('YYYY-MM-DD HH:mm:ss')
  })
  if (getHistoryRainMonitorSegmentRes.state === 0) {
    // console.log('getHistoryRainMonitorSegmentRes', getHistoryRainMonitorSegmentRes)
    timeStatisticTopTableData.value = getHistoryRainMonitorSegmentRes.data.rainMonitorSegs
  }
}

const getGradingSiteInfo = async () => {
  const region = WPAdministrativeArea.get(allRegionSelectedValue.value)
  const getGradingSiteInfoRes = await magnitudeRain_getGradingSiteInfo({
    projectId,
    areaId: region.id,
    type: region.level,
    begin: dayjs(selectedTimeValue.value[0]).format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(selectedTimeValue.value[1]).format('YYYY-MM-DD HH:mm:ss')
  })
  if (getGradingSiteInfoRes.state === 0) {
    // console.log('getGradingSiteInfoRes', getGradingSiteInfoRes)
    detailedQueryTableData.value = getGradingSiteInfoRes.data
  }
}

const getArbitrarilyRainMonitorByArea = async () => {
  const region = WPAdministrativeArea.get(allRegionSelectedValue.value)
  const getArbitrarilyRainMonitorByAreaRes = await magnitudeRain_getArbitrarilyRainMonitorByArea({
    projectId,
    areaId: region.id,
    type: region.level,
    time: dayjs(refreshTime).format('YYYY-MM-DD HH:mm:ss')
  })
  if (getArbitrarilyRainMonitorByAreaRes.state === 0) {
    // console.log('getArbitrarilyRainMonitorByAreaRes', getArbitrarilyRainMonitorByAreaRes)
    oneHourTableData.value = getArbitrarilyRainMonitorByAreaRes.data.OneHour
    threeHourTableData.value = getArbitrarilyRainMonitorByAreaRes.data.ThreeHour
  }
}

const timeStatistic = () => {
  getHistoryRainMonitorSegment()
}

const maxRainfallStatistic = () => {
  getArbitrarilyRainMonitorByArea()
}

const detailedQuery = () => {
  selectedTimeValue.value = [
    dayjs(refreshTime).subtract(24, 'h').toDate(),
    dayjs(refreshTime).toDate()
  ]
  getGradingSiteInfo()
}

onBeforeMount(() => {
  timeStatistic()
  maxRainfallStatistic()
  detailedQuery()
})

watch(
  () => {
    return allRegionSelectedValue.value
  },
  () => {
    timeStatistic()
    maxRainfallStatistic()
    detailedQuery()
  }
)

watch(
  () => refreshTime,
  () => {
    timeStatistic()
    maxRainfallStatistic()
    detailedQuery()
  }
)
</script>

<template>
  <div class="rainfall-query">
    <el-select class="region-select" v-model="allRegionSelectedValue" filterable>
      <el-option
        v-for="region in allRegion"
        :key="region.id"
        :label="region.name"
        :value="region.id"
      />
    </el-select>
    <div class="statistic-type-btn">
      <el-button
        v-for="statisticType in statisticTypeOptions"
        :key="statisticType"
        :type="currentStatisticType === statisticType ? 'primary' : 'default'"
        @click="handleClickStatisticTypeBtn(statisticType)"
      >
        {{ statisticType }}
      </el-button>
    </div>
    <div class="rainfall-query-content">
      <div class="time-statistic" v-if="currentStatisticType === '分时段统计'">
        <div class="time-statistic-table">
          <el-table :data="timeStatisticTopTableData" width="100%" height="100%" border>
            <el-table-column
              align="center"
              v-for="tableColumn in timeStatisticTopTableColumn"
              :key="tableColumn.prop"
              :prop="tableColumn.prop"
              :label="tableColumn.label"
              :sortable="tableColumn.sortable"
              :width="tableColumn.width"
              :fixed="tableColumn.fixed"
            />
          </el-table>
        </div>
      </div>
      <div class="max-rainfall-statistic" v-if="currentStatisticType === '最大雨量统计'">
        <div class="one-hour-table">
          <el-table :data="oneHourTableData" width="100%" height="100%" border>
            <el-table-column label="近24小时内任意1小时最大雨量排名">
              <el-table-column
                align="center"
                v-for="tableColumn in maxRainfallTableColumn"
                :key="tableColumn.prop"
                :prop="tableColumn.prop"
                :label="tableColumn.label"
                :sortable="tableColumn.sortable"
                :width="tableColumn.width"
                :fixed="tableColumn.fixed"
              />
            </el-table-column>
          </el-table>
        </div>
        <div class="tree-hour-table">
          <el-table :data="threeHourTableData" width="100%" height="100%" border>
            <el-table-column label="近24小时内任意3小时最大雨量排名">
              <el-table-column
                align="center"
                v-for="tableColumn in maxRainfallTableColumn"
                :key="tableColumn.prop"
                :prop="tableColumn.prop"
                :label="tableColumn.label"
                :sortable="tableColumn.sortable"
                :width="tableColumn.width"
                :fixed="tableColumn.fixed"
              />
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="detailed-query" v-if="currentStatisticType === '详细查询'">
        <el-date-picker type="datetimerange" v-model="selectedTimeValue" :shortcuts="shortcuts" />
        <div class="control">
          <el-select style="flex: 2" v-model="selectedRainfallLevelValue" filterable>
            <el-option
              v-for="level in rainfallLevelOptions"
              :key="level.value"
              :label="level.label"
              :value="level.value"
            />
          </el-select>
          <el-button style="flex: 1" :icon="Search" @click="getGradingSiteInfo" />
        </div>
        <div class="detailed-query-table">
          <el-table
            :data="detailedQueryTableData[selectedRainfallLevelValue]"
            width="100%"
            height="100%"
            border
          >
            <el-table-column
              v-for="tableColumn in detailedQueryTableColumn"
              :key="tableColumn.prop"
              :prop="tableColumn.prop"
              :label="tableColumn.label"
              :sortable="tableColumn.sortable"
              :formatter="tableColumn.formatter"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rainfall-query {
  width: 100%;
  height: 100%;
  .region-select {
    width: 100%;
    margin-bottom: 10px;
  }
  .statistic-type-btn {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .el-button {
      flex: 1;
    }
  }
  .rainfall-query-content {
    width: 100%;
    height: calc(100% - 100px);
    .time-statistic,
    .max-rainfall-statistic,
    .detailed-query {
      width: 100%;
      height: 100%;
      .time-statistic-table {
        width: 100%;
        height: 100%;
      }
      .one-hour-table,
      .tree-hour-table {
        width: 100%;
        height: 50%;
      }
      :deep(.el-date-editor) {
        width: 100%;
        padding: 0;
        box-sizing: border-box;
        margin-bottom: 10px;
        .el-range-separator {
          flex: 0.5;
        }
      }
      .control {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .detailed-query-table {
        width: 100%;
        height: calc(100% - 100px);
      }
    }
  }
}
</style>
