<script setup>
import lodash from 'lodash'
import { ref, reactive, onBeforeMount } from 'vue'

const WPMonitoringPoints = window.WPD.get('WPMonitoringPoints')
let WPMonitoringPointList = ref({})
const searchValue = ref('')
const allWPDMonitoringPoints = reactive([])
let copyWPMonitoringPointList = null

const initWPMonitoringPointList = () => {
  WPMonitoringPoints.forEach((item, key) => {
    if (['field', 'cityMonitor', 'waterMonitor'].includes(key)) return
    allWPDMonitoringPoints.push({
      ...item,
      value: item.NAME
    })
    if (WPMonitoringPointList.value[item.SOURCE]) {
      WPMonitoringPointList.value[item.SOURCE].push(item)
    } else {
      WPMonitoringPointList.value[item.SOURCE] = [item]
    }
  })
  // console.log(WPMonitoringPointList)
  copyWPMonitoringPointList = lodash.cloneDeep(WPMonitoringPointList.value)
}

onBeforeMount(() => {
  initWPMonitoringPointList()
})

const querySearch = (queryString, cb) => {
  const results = queryString
    ? allWPDMonitoringPoints.filter((item) => {
        return item.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
      })
    : allWPDMonitoringPoints
  cb(results)
}

const selectVideoMonitor = (item) => {
  WPMonitoringPointList.value = {
    [item.SOURCE]: [item]
  }
}

const clearSelectedVideoMonitor = () => {
  WPMonitoringPointList.value = lodash.cloneDeep(copyWPMonitoringPointList)
}
</script>

<template>
  <div class="video-monitor-list">
    <el-autocomplete
      placeholder="请输入内容"
      clearable
      v-model="searchValue"
      :fetch-suggestions="querySearch"
      @select="selectVideoMonitor"
      @clear="clearSelectedVideoMonitor"
    />
    <div class="content">
      <div class="content-title">
        <div class="title">名称</div>
        <div class="num">数量</div>
      </div>
      <el-collapse class="collapse-content">
        <el-collapse-item
          v-for="(WPMonitoringPoint, WPMonitoringPointType) in WPMonitoringPointList"
          :key="WPMonitoringPointType"
        >
          <template #title>
            <div class="type">
              <div class="title">{{ WPMonitoringPointType }}</div>
              <div class="num">{{ WPMonitoringPoint.length }}</div>
            </div>
          </template>
          <el-table max-height="300" :data="WPMonitoringPoint">
            <el-table-column prop="NAME" label="名称" align="center" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-monitor-list {
  width: 100%;
  height: 100%;
  :deep(.el-autocomplete) {
    margin: 10px 0;
    width: 100%;
  }
  :deep(.el-table__header-wrapper) {
    display: none;
  }
  .content {
    width: 100%;
    height: calc(100% - 60px);
    .content-title {
      width: 100%;
      height: 50px;
      display: flex;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .collapse-content {
      width: 100%;
      height: 100%;
      overflow: auto;
      :deep(.el-collapse-item__content) {
        padding: 0;
      }
    }
  }
  .type {
    width: 100%;
    display: flex;
  }
  .title,
  .num {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
