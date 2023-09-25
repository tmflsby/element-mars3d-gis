<script setup>
import { reactive, computed } from 'vue'
import { useDataSourceStore } from '@/stores/dataSource'

const dataSourceStore = useDataSourceStore()
const waterEngineeringSituation = computed(() => dataSourceStore.waterEngineeringSituation)

const exceedFloodTableColumn = reactive([
  { prop: 'name', label: '站名', class: 'name', align: 'center' },
  { prop: 'waterLev', label: '水位', class: 'water-level', align: 'center' },
  { prop: 'outWarn', label: '超警值', class: 'exceed-value', align: 'center' },
  { prop: 'cityName', label: '所在区域', class: 'region', align: 'center' }
])

const exceedFloodData = reactive([
  {
    title: '超保证水位',
    data: [].concat(
      waterEngineeringSituation.value.WPStationZQ.outZQGuarantys,
      waterEngineeringSituation.value.WPStationZZ.outZZGuarantys
    )
  },
  {
    title: '超警戒水位',
    data: [].concat(
      waterEngineeringSituation.value.WPStationZQ.outZQAlarms,
      waterEngineeringSituation.value.WPStationZZ.outZZAlarm
    )
  }
])

const allExceedFloodStation = computed(() => {
  return exceedFloodData[0].data.concat(exceedFloodData[1].data)
})
</script>

<template>
  <div class="exceed-warning-station">
    <div class="title">
      <div
        v-for="tableColumn in exceedFloodTableColumn"
        :key="tableColumn.prop"
        :class="tableColumn.class"
      >
        {{ tableColumn.label }}
      </div>
    </div>
    <el-collapse class="collapse-content" v-if="allExceedFloodStation.length > 0">
      <template v-for="type in exceedFloodData" :key="type.title">
        <el-collapse-item v-if="type.data.length > 0">
          <template #title>
            <div class="type">{{ type.title }}</div>
          </template>
          <el-table max-height="300" :data="type.data">
            <el-table-column
              v-for="tableColumn in exceedFloodTableColumn"
              :key="tableColumn.prop"
              :prop="tableColumn.prop"
              :label="tableColumn.label"
              :align="tableColumn.align"
            />
          </el-table>
        </el-collapse-item>
      </template>
    </el-collapse>
    <el-empty description="当前时间暂无超警站点" />
  </div>
</template>

<style scoped lang="scss">
.exceed-warning-station {
  width: 100%;
  height: 100%;
  .collapse-content {
    width: 100%;
    height: 100%;
    overflow: auto;
    :deep(.el-collapse-item__content) {
      padding: 0;
    }
    :deep(.el-table__header-wrapper) {
      display: none;
    }
  }
  .title {
    width: 100%;
    height: 50px;
    display: flex;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .name,
  .water-level,
  .exceed-value,
  .region,
  .type {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
