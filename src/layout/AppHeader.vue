<script setup>
import dayjs from 'dayjs'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const systemTime = computed(() => systemStore.systemTime)
const changeSystemTime = systemStore.changeSystemTime
const changeRefreshTime = systemStore.changeRefreshTime
const userInfo = computed(() => systemStore.userInfo)

const title = window.layoutJson.title
const routes = window.layoutJson.routes

const router = useRouter()
// console.log(router)
const defaultActive = ref(router.currentRoute.value.path)

const realtimeRefresh = ref(true)
const setSystemTimeInputValue = ref('')

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

let timer = setInterval(() => {
  formatSystemTime()
}, 1000)

const formatSystemTime = (systemTime) => {
  // YYYY-MM-DD 星期几 HH:mm:ss
  const date = dayjs(systemTime).format('YYYY-MM-DD')
  const week = formatWeek(dayjs(systemTime).format('dddd'))
  const time = dayjs(systemTime).format('HH:mm:ss')
  changeSystemTime(`${date} ${week} ${time}`)
}

const logout = () => {
  router.push('/login')
}

const searchSystemTime = () => {
  if (dayjs(setSystemTimeInputValue.value).isValid()) {
    // 清除定时器
    clearInterval(timer)
    timer = null
    formatSystemTime(setSystemTimeInputValue.value)
    setSystemTimeInputValue.value = dayjs(setSystemTimeInputValue.value).format(
      'YYYY-MM-DD HH:mm:ss'
    )
  } else {
    ElMessage({
      message: '请输入正确的时间格式',
      type: 'warning'
    })
    setSystemTimeInputValue.value = ''
  }
}

const backToRealtime = () => {
  // 重新开启定时器
  timer = setInterval(() => {
    formatSystemTime()
  }, 1000)

  setTimeout(() => {
    const refreshTime = systemTimeToRefreshTime()
    changeRefreshTime(refreshTime)
  }, 1000)

  setSystemTimeInputValue.value = ''
}

const systemTimeToRefreshTime = () => {
  const date = systemTime.value.split(' ')[0]
  const time = systemTime.value.split(' ')[2]
  return `${date} ${time}`
}

watch(
  () => systemTime.value,
  () => {
    const refreshTime = systemTimeToRefreshTime()
    // 如果是整5分钟，就刷新一次
    if (dayjs(refreshTime).get('minute') % 5 === 0 && dayjs(refreshTime).get('second') === 0) {
      changeRefreshTime(refreshTime)
    }
  }
)
</script>

<template>
  <el-card class="app-header">
    <div class="app-header-left">
      <el-popover trigger="hover" width="500">
        <div class="set-system-time">
          <el-checkbox style="margin-right: 10px" v-model="realtimeRefresh">实时刷新</el-checkbox>
          <el-input
            style="margin-right: 10px"
            v-model="setSystemTimeInputValue"
            placeholder="请输入时间"
          />
          <el-button @click="searchSystemTime">查询</el-button>
          <el-button @click="backToRealtime">实时</el-button>
        </div>
        <template #reference>
          <span>{{ systemTime }}</span>
        </template>
      </el-popover>
    </div>
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
    <div class="app-header-right">
      <el-dropdown class="dropdown" popper-class="system-setting-dropdown">
        <div class="dropdown-title">{{ userInfo.nickName }}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
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
      .dropdown {
        .dropdown-title {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          cursor: pointer;
          span {
            margin-right: 10px;
          }
        }
      }
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

.set-system-time {
  display: flex;
  align-items: center;
}
</style>
