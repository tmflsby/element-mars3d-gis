<script setup>
import dayjs from 'dayjs'
import { reactive, computed, onBeforeMount, watch } from 'vue'
import { sift_siftObj } from '@/api/sift'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)
const selectedDept = systemStore.selectedDept

const warningLevel = reactive([
  {
    title: '红色预警',
    color: 'red',
    level: 1,
    value: 0
  },
  {
    title: '橙色预警',
    color: 'orange',
    level: 2,
    value: 0
  },
  {
    title: '黄色预警',
    color: 'gold',
    level: 3,
    value: 0
  },
  {
    title: '蓝色预警',
    color: 'royalblue',
    level: 4,
    value: 0
  }
])

onBeforeMount(() => {
  getMountainTorrentWarning()
})

const getMountainTorrentWarning = async () => {
  let villageWarnStaticInfoUrl = `${window.baseUrl.mountainTorrent}/EarlyWarning/Api/GetVillageWarnStaticInfo?`
  villageWarnStaticInfoUrl += `addvcd=${selectedDept.code}&dtBegin=${dayjs(refreshTime.value)
    .subtract(1, 'day')
    .format('YYYY-MM-DD HH:mm')}&dtEnd=${dayjs(refreshTime.value).format(
    'YYYY-MM-DD HH:mm'
  )}&WarnState=1,2,3,4&DisposeState=0,1&`

  const siftObjRes = await sift_siftObj(
    {},
    {
      link: btoa(unescape(encodeURIComponent(villageWarnStaticInfoUrl)))
    }
  )
  if (siftObjRes.state === 0) {
    const villageWarnStaticInfo = siftObjRes.data.Data
    for (let i = 0; i < villageWarnStaticInfo.length; i++) {
      switch (villageWarnStaticInfo[i].Level) {
        case 1:
          warningLevel[0].value = villageWarnStaticInfo[i].TwonCount
          break
        case 2:
          warningLevel[1].value = villageWarnStaticInfo[i].TwonCount
          break
        case 3:
          warningLevel[2].value = villageWarnStaticInfo[i].TwonCount
          break
        case 4:
          warningLevel[3].value = villageWarnStaticInfo[i].TwonCount
          break
      }
    }
  }
}

watch(
  () => refreshTime.value,
  () => {
    getMountainTorrentWarning()
  }
)
</script>

<template>
  <div class="mountain-torrent-warning">
    <el-card
      class="mountain-torrent-warning-item"
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
</template>

<style scoped lang="scss">
.mountain-torrent-warning {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .mountain-torrent-warning-item {
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
</style>
