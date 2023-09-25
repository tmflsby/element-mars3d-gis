<script setup>
import { reactive, computed } from 'vue'
import { formatStation, formatWaterLevel } from '@/utils/format'
import { useDataSourceStore } from '@/stores/dataSource'

const dataSourceStore = useDataSourceStore()
const waterEngineeringStation = computed(() => dataSourceStore.waterEngineeringStation)

const allWaterStationTableColumn = reactive([
  {
    prop: 'sttp',
    label: '类型',
    sortable: true,
    width: 85,
    formatter: (row, column, cellValue) => {
      return formatStation(cellValue)
    }
  },
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
    prop: 'alarmZ',
    label: '警戒水位',
    sortable: true,
    width: 120,
    formatter: (row, column, cellValue) => {
      return formatWaterLevel(cellValue)
    }
  },
  {
    prop: 'guarantyZ',
    label: '保证水位',
    sortable: true,
    width: 120,
    formatter: (row, column, cellValue) => {
      return formatWaterLevel(cellValue)
    }
  }
])

const allWaterStationTableData = [].concat(
  waterEngineeringStation.value.WPStationZZ,
  waterEngineeringStation.value.WPStationZQ
)
</script>

<template>
  <div class="all-water-station">
    <el-table :data="allWaterStationTableData" width="100%" height="100%" border>
      <el-table-column
        align="center"
        v-for="tableColumn in allWaterStationTableColumn"
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
.all-water-station {
  width: 100%;
  height: 100%;
}
</style>
