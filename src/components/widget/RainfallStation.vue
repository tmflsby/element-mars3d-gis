<script setup>
import { reactive, computed } from 'vue'
import { useDataSourceStore } from '@/stores/dataSource'

const dataSourceStore = useDataSourceStore()
const rainSituation = computed(() => dataSourceStore.rainSituation)
rainSituation.value = rainSituation.value.sort((a, b) => {
  return b.drp - a.drp
})

const rainfallStationTableColumn = reactive([
  {
    prop: 'sttp',
    label: '类型',
    sortable: true,
    width: 85,
    fixed: 'left',
    formatter: (row, column, cellValue) => {
      switch (cellValue) {
        case 'WPStationPP':
          return '雨量站'
        case 'WPStationZZ':
          return '水位站'
        case 'WPStationZQ':
          return '水文站'
        case 'WPStationRR':
          return '水库站'
        default:
          return '-'
      }
    }
  },
  { prop: 'stnm', label: '名称', sortable: false, width: 100, fixed: 'left' },
  { prop: 'countyAdnm', label: '区县市', sortable: true, width: 100 },
  { prop: 'townAdnm', label: '乡镇', sortable: true, width: 85 },
  { prop: 'magnitude', label: '等级', sortable: true, width: 85 },
  { prop: 'drp', label: '雨量（mm）', sortable: true, width: 150 }
])
</script>

<template>
  <div class="rainfall-station">
    <el-table :data="rainSituation" width="100%" height="100%" border>
      <el-table-column
        align="center"
        v-for="tableColumn in rainfallStationTableColumn"
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
.rainfall-station {
  width: 100%;
  height: 100%;
}
</style>
