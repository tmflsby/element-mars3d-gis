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
    title: '超防洪高水位',
    data: [
      {
        title: '大中型水库',
        data: waterEngineeringSituation.value.WPStationRR.newOutRRFhControls
          .outRRFhControlsLargeToMedium
      },
      {
        title: '小型水库',
        data: waterEngineeringSituation.value.WPStationRR.newOutRRFhControls.outRRFhControlsSmall
      }
    ]
  },
  {
    title: '超汛限水位',
    data: [
      {
        title: '大中型水库',
        data: waterEngineeringSituation.value.WPStationRR.newOutRRXhs.outRRXHsLargeToMedium
      },
      {
        title: '小型水库',
        data: waterEngineeringSituation.value.WPStationRR.newOutRRXhs.outRRXHsSmall
      }
    ]
  }
])

const allExceedFloodStation = computed(() => {
  return (
    waterEngineeringSituation.value.WPStationRR.outRRFhControlsLargeToMediumCount +
    waterEngineeringSituation.value.WPStationRR.outRRFhControlsSmallCount +
    waterEngineeringSituation.value.WPStationRR.outRRXHsLargeToMediumCount +
    waterEngineeringSituation.value.WPStationRR.outRRXHsSmallCount
  )
})
</script>

<template>
  <div class="exceed-flood-limit-station">
    <div class="title">
      <div
        v-for="tableColumn in exceedFloodTableColumn"
        :key="tableColumn.prop"
        :class="tableColumn.class"
      >
        {{ tableColumn.label }}
      </div>
    </div>
    <el-collapse class="collapse-content" v-if="allExceedFloodStation > 0">
      <template v-for="type in exceedFloodData" :key="type.title">
        <el-collapse-item v-if="type.data[0].data.length + type.data[1].data.length > 0">
          <template #title>
            <div class="type">{{ type.title }}</div>
          </template>

          <el-collapse>
            <template v-for="stationType in type.data" :key="stationType.title">
              <el-collapse-item v-if="stationType.data.length > 0">
                <template #title>
                  <div class="type">{{ stationType.title }}</div>
                </template>
                <el-table max-height="300" :data="stationType.data">
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
        </el-collapse-item>
      </template>
    </el-collapse>
    <el-empty description="当前时间暂无超警站点" />
  </div>
</template>

<style scoped lang="scss">
.exceed-flood-limit-station {
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
