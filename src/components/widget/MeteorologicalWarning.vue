<script setup>
import dayjs from 'dayjs'
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { AlarmSingal_Page } from '@/api/weather'
import { useSystemStore } from '@/stores/system'
import { useDataSourceStore } from '@/stores/dataSource'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)
const userInfo = systemStore.userInfo

const dataSourceStore = useDataSourceStore()
const meteorologicalWarning = computed(() => dataSourceStore.meteorologicalWarning)
const setMeteorologicalWarning = dataSourceStore.setMeteorologicalWarning

const selectValue = ref(['暴雨', '高温'])
const selectOptions = [
  '冰雹',
  '台风',
  '大雾',
  '大风',
  '寒潮',
  '山体滑坡',
  '干旱',
  '强季风',
  '暴雨',
  '暴雪',
  '森林火险',
  '沙尘暴',
  '道路结冰',
  '雷暴',
  '雷电',
  '霜冻',
  '霾',
  '高温'
]

const warningLevel = reactive([
  {
    title: '红色预警',
    color: 'red',
    level: 4,
    value: 0
  },
  {
    title: '橙色预警',
    color: 'orange',
    level: 3,
    value: 0
  },
  {
    title: '黄色预警',
    color: 'yellow',
    level: 2,
    value: 0
  },
  {
    title: '蓝色预警',
    color: 'blue',
    level: 1,
    value: 0
  }
])

onBeforeMount(() => {
  getMeteorologicalWarning()
})

const getMeteorologicalWarning = async () => {
  const getAlarmSingalRes = await AlarmSingal_Page({
    City: userInfo.deptName, // 市级名称
    SignalCategory: '0', // 0：县级发布、1：市级发布、2：省级发布
    StatusFilter: '0', // 0：所有，1：未解除，2：已解除
    StartTime: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    EndTime: refreshTime.value,
    PageSize: 10000,
    PageNo: 1
  })
  if (getAlarmSingalRes.code === 200 && getAlarmSingalRes.success) {
    setMeteorologicalWarning(getAlarmSingalRes.data.items)
    filterMeteorologicalWarningLevel()
  }
}

const handleChangeSelected = () => {
  filterMeteorologicalWarningLevel()
}

const filterMeteorologicalWarningLevel = () => {
  // 重置warningLevel
  for (let i = 0; i < warningLevel.length; i++) {
    warningLevel[i].value = 0
  }

  for (let i = 0; i < meteorologicalWarning.value.length; i++) {
    const item = meteorologicalWarning.value[i]
    if (selectValue.value.indexOf(item.signalType) !== -1) {
      switch (item.level) {
        case 1:
          warningLevel[3].value++
          break
        case 2:
          warningLevel[2].value++
          break
        case 3:
          warningLevel[1].value++
          break
        case 4:
          warningLevel[0].value++
          break
      }
    }
  }
}

watch(
  () => refreshTime.value,
  () => {
    getMeteorologicalWarning()
  }
)
</script>

<template>
  <div class="meteorological-warning">
    <el-select filterable multiple v-model="selectValue" @change="handleChangeSelected">
      <el-option v-for="item in selectOptions" :key="item" :label="item" :value="item" />
    </el-select>
    <div class="meteorological-warning-level">
      <el-card
        class="meteorological-warning-level-item"
        v-for="item in warningLevel"
        :key="item.title"
        :style="{
          color: item.color,
          fontWeight: 'bold'
        }"
      >
        <div class="title">{{ item.title }}</div>
        <div class="value">{{ item.value }}</div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meteorological-warning {
  width: 100%;
  height: 100%;
  :deep(.el-select) {
    width: 100%;
    margin-bottom: 10px;
  }
  .meteorological-warning-level {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    justify-content: space-between;
    .meteorological-warning-level-item {
      width: 23%;
      height: 100%;
      :deep(.el-card__body) {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
}
</style>
