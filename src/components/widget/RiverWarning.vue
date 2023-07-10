<script setup>
import dayjs from 'dayjs'
import { reactive, computed, onBeforeMount, watch } from 'vue'
import { sift_siftObj } from '@/api/sift'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)
const userInfo = systemStore.userInfo

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
    color: 'yellow',
    level: 3,
    value: 0
  },
  {
    title: '蓝色预警',
    color: 'blue',
    level: 4,
    value: 0
  }
])

onBeforeMount(() => {
  getRiverWarning()
})

const getRiverWarning = async () => {
  let staticInfoUnitUrl = `${window.baseUrl.mountainTorrent}/EarlyWarning/Api/GetStaticInfoUnit?`
  staticInfoUnitUrl += `addvcd=${userInfo.dept.code}&dtBegin=${dayjs(refreshTime.value)
    .subtract(1, 'day')
    .format('YYYY-MM-DD HH:mm')}&dtEnd=${dayjs(refreshTime.value).format('YYYY-MM-DD HH:mm')}`

  const siftObjRes = await sift_siftObj(
    {},
    {
      link: btoa(unescape(encodeURIComponent(staticInfoUnitUrl)))
    }
  )
  if (siftObjRes.state === 0) {
    const staticInfoUnit = siftObjRes.data.Data

    for (let i = 0; i < staticInfoUnit.length; i++) {
      switch (staticInfoUnit[i].LevelH) {
        case 1:
          warningLevel[0].value = staticInfoUnit[i].RivelCount
          break
        case 2:
          warningLevel[1].value = staticInfoUnit[i].RivelCount
          break
        case 3:
          warningLevel[2].value = staticInfoUnit[i].RivelCount
          break
        case 4:
          warningLevel[3].value = staticInfoUnit[i].RivelCount
          break
      }
    }
  }
}

watch(
  () => refreshTime.value,
  () => {
    getRiverWarning()
  }
)
</script>

<template>
  <div class="river-warning">
    <el-card
      class="river-warning-item"
      v-for="item in warningLevel"
      :key="item.title"
      :style="{
        color: item.color,
        fontWeight: 'bold'
      }"
    >
      <div class="river-warning-item-title">{{ item.title }}</div>
      <div class="river-warning-item-value">{{ item.value }}</div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.river-warning {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .river-warning-item {
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
