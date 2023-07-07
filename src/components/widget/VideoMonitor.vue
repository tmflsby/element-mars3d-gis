<script setup>
import Hls from 'hls.js'
import { ref, reactive, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

const hls = new Hls()

const videoMonitorType = reactive([])
const allMonitorPoints = window.WPD.get('WPMonitoringPoints')
const selectedMonitorPoint = ref('126')
const selectedMonitorPointUrl = ref(allMonitorPoints.get(selectedMonitorPoint.value).URL[0])
const monitorOptions = reactive([])

watch(
  () => selectedMonitorPoint.value,
  (newValue, oldValue) => {
    selectedMonitorPointUrl.value = allMonitorPoints.get(newValue).URL?.[0]
    if (selectedMonitorPointUrl.value) {
      hls.loadSource(selectedMonitorPointUrl.value)
    } else {
      ElMessage({
        message: '该监控点暂无视频',
        type: 'warning'
      })
      selectedMonitorPoint.value = oldValue
    }
  }
)

const getVideoMonitorType = () => {
  const waterMonitor = []
  const cityMonitor = []
  allMonitorPoints.forEach((item) => {
    switch (item.SOURCE) {
      case '水利监控':
        waterMonitor.push(item)
        break
      case '城管监控':
        cityMonitor.push(item)
        break
      default:
        break
    }
  })
  videoMonitorType.push(
    ...[
      {
        name: '水利监控',
        id: 'waterMonitor',
        value: waterMonitor
      },
      {
        name: '城管监控',
        id: 'cityMonitor',
        value: cityMonitor
      }
    ]
  )

  window.WPD.get('WPMonitoringPoints').set('waterMonitor', waterMonitor)
  window.WPD.get('WPMonitoringPoints').set('cityMonitor', cityMonitor)
  monitorOptions.push(...waterMonitor, ...cityMonitor)
}

onBeforeMount(() => {
  getVideoMonitorType()
})

const playVideo = () => {
  const video = document.querySelector('.video')
  hls.loadSource(selectedMonitorPointUrl.value)
  hls.attachMedia(video)
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    video.play()
  })
  hls.startLoad()
}

onMounted(() => {
  playVideo()
})

onBeforeUnmount(() => {
  hls.destroy()
})

const videoPlay = () => {
  hls.startLoad()
}
const videoPause = () => {
  hls.stopLoad()
}
</script>

<template>
  <div class="video-monitor">
    <div class="statistic-content">
      <el-card class="statistic-content-item" v-for="item in videoMonitorType" :key="item.id">
        <div class="statistic-content-item-name">{{ item.name }}</div>
        <div class="statistic-content-item-value">{{ item.value.length }}</div>
      </el-card>
    </div>
    <div class="search-select">
      <el-select filterable v-model="selectedMonitorPoint">
        <el-option
          v-for="item in monitorOptions"
          :key="item.ORDER_INDEX"
          :label="item.NAME"
          :value="item.ORDER_INDEX"
        />
      </el-select>
    </div>
    <div class="video-container">
      <video class="video" controls autoplay @play="videoPlay" @pause="videoPause"></video>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-monitor {
  width: 100%;
  height: 100%;
  .statistic-content {
    width: 100%;
    height: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
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
  .search-select {
    width: 100%;
    :deep(.el-select) {
      width: 100%;
    }
  }
  .video-container {
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 100px);
    .video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
