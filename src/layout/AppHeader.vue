<script setup>
import dayjs from 'dayjs'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const systemTime = computed(() => systemStore.systemTime)
const changeSystemTime = systemStore.changeSystemTime
const userInfo = computed(() => systemStore.userInfo)

const title = window.layoutJson.title
const routes = window.layoutJson.routes

const router = useRouter()
// console.log(router)
const defaultActive = ref(router.currentRoute.value.path)

const handleSelectMenu = (index) => {
  router.push(index)
}

const formatWeek = (week) => {
  let weekCN = ''
  switch (week) {
    case 'Monday':
      weekCN = '星期一'
      break
    case 'Tuesday':
      weekCN = '星期二'
      break
    case 'Wednesday':
      weekCN = '星期三'
      break
    case 'Thursday':
      weekCN = '星期四'
      break
    case 'Friday':
      weekCN = '星期五'
      break
    case 'Saturday':
      weekCN = '星期六'
      break
    case 'Sunday':
      weekCN = '星期日'
      break
  }
  return weekCN
}

setInterval(() => {
  // YYYY-MM-DD 星期几 HH:mm:ss
  const date = dayjs().format('YYYY-MM-DD')
  const week = formatWeek(dayjs().format('dddd'))
  const time = dayjs().format('HH:mm:ss')
  changeSystemTime(`${date} ${week} ${time}`)
}, 1000)
</script>

<template>
  <el-card class="app-header">
    <div class="app-header-left">{{ systemTime }}</div>
    <div class="app-header-content">
      <el-menu
        :default-active="defaultActive"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelectMenu"
      >
        <template v-for="route in routes" :key="route.name">
          <div class="title" v-if="route.afterSystemTitle">{{ title }}</div>
          <el-menu-item class="menu-item" :index="route.path">{{ route.title }}</el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="app-header-right">{{ userInfo.nickName }}</div>
  </el-card>
</template>

<style scoped lang="scss">
.app-header {
  width: 100%;
  height: 100%;
  :deep(.el-card__body) {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .app-header-left,
    .app-header-right {
      font-size: 20px;
      width: 300px;
      height: 100%;
    }
    .app-header-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .app-header-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .app-header-content {
      font-size: 30px;
      .title {
        margin: 0 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .menu-item {
        margin: 0 50px;
      }
    }
  }
}
</style>
