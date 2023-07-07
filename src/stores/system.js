import dayjs from 'dayjs'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', () => {
  const systemTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const refreshTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const userInfo = ref({})
  const changeSystemTime = (time) => {
    // console.log('changeSystemTime', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    systemTime.value = time
  }
  const changeRefreshTime = (time) => {
    refreshTime.value = time
  }

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  return {
    systemTime,
    refreshTime,
    userInfo,
    changeSystemTime,
    changeRefreshTime,
    setUserInfo
  }
})
