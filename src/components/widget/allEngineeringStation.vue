<script setup>
import { reactive, computed } from 'vue'
import { formatWaterLevel } from '@/utils/format'
import { useDataSourceStore } from '@/stores/dataSource'

const dataSourceStore = useDataSourceStore()
const waterEngineeringStation = computed(() => dataSourceStore.waterEngineeringStation)

const allEngineeringStationTableData = waterEngineeringStation.value.WPStationRR
const allEngineeringStationTableColumn = reactive([
  { prop: 'stnm', label: '站点', sortable: false, width: 100, fixed: 'left' },
  { prop: 'countAdnm', label: '区县市', sortable: true, width: 100 },
  {
    prop: 'lastZ',
    label: '水位',
    sortable: true,
    width: 85,
    formatter: (row, column, cellValue) => {
      return formatWaterLevel(cellValue)
    }
  },
  {
    prop: 'xhz',
    label: '防洪限制水位',
    sortable: true,
    width: 150,
    formatter: (row, column, cellValue) => {
      return formatWaterLevel(cellValue)
    }
  },
  {
    prop: 'fhz',
    label: '正常蓄水位',
    sortable: true,
    width: 130,
    formatter: (row, column, cellValue) => {
      return formatWaterLevel(cellValue)
    }
  }
])
</script>

<template>
  <div class="all-engineering-station">
    <el-table :data="allEngineeringStationTableData" width="100%" height="100%" border>
      <el-table-column
        align="center"
        v-for="tableColumn in allEngineeringStationTableColumn"
        :key="tableColumn.prop"
        :prop="tableColumn.prop"
        :label="tableColumn.label"
        :sortable="tableColumn.sortable"
        :width="tableColumn.width"
        :fixed="tableColumn.fixed"
        :formatter="tableColumn.formatter"
      />
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.all-engineering-station {
  width: 100%;
  height: 100%;
}
</style>
