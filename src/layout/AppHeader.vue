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
const systemTimeDatePicker = ref('')

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
  router.push({ path: '/login' })
}

const searchSystemTime = () => {
  if (systemTimeDatePicker.value === '') {
    ElMessage.warning('请选择日期时间')
    return
  }
  // 清除定时器
  clearInterval(timer)
  timer = null
  formatSystemTime(systemTimeDatePicker.value)
  realtimeRefresh.value = false
  changeRefreshTime(dayjs(systemTimeDatePicker.value).format('YYYY-MM-DD HH:mm:ss'))
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

  systemTimeDatePicker.value = ''
  realtimeRefresh.value = true
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

const cardBodyStyle = ref({
  width: '100%',
  height: '100%',
  padding: '0 20px',
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})
</script>

<template>
  <el-card class="w-100% h-100%" :body-style="cardBodyStyle">
    <div class="w-300px h-100% text-20px flex-sc">
      <el-popover trigger="click" width="500" :teleported="false">
        <div class="flex-bc">
          <el-checkbox v-model="realtimeRefresh">实时刷新</el-checkbox>
          <el-date-picker
            type="datetime"
            placeholder="选择日期时间"
            :teleported="false"
            v-model="systemTimeDatePicker"
          />
          <el-button @click="searchSystemTime">查询</el-button>
          <el-button style="margin: 0" @click="backToRealtime">实时</el-button>
        </div>
        <template #reference>
          <span>{{ systemTime }}</span>
        </template>
      </el-popover>
    </div>
    <div class="text-30px">
      <el-menu
        :default-active="defaultActive"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelectMenu"
      >
        <template v-for="route in routes" :key="route.name">
          <div class="flex-cc" style="margin: 0 40px" v-if="route.afterSystemTitle">
            {{ title }}
          </div>
          <el-menu-item style="margin: 0 40px; font-size: 18px" :index="route.path">
            {{ route.title }}
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="w-300px h-100% text-20px flex-ec">
      <el-dropdown>
        <div>{{ userInfo.nickName }}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-card>
</template>
