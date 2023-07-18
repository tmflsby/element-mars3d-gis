import dayjs from 'dayjs'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { setLocalStorage, getLocalStorage } from '@/utils/storage'

export const useSystemStore = defineStore('system', () => {
  const systemTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const refreshTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const userInfo = ref({})
  const selectedDept = ref({})

  const changeSystemTime = (time) => {
    // console.log('changeSystemTime', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    systemTime.value = time
  }
  const changeRefreshTime = (time) => {
    refreshTime.value = time
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    const localStorageSelectedDept = getLocalStorage('selectedDept')
    // console.log('localStorageSelectedDept', localStorageSelectedDept)
    if (localStorageSelectedDept && info.dept.name === '三明市') {
      selectedDept.value = localStorageSelectedDept
    } else {
      selectedDept.value = {
        code: info.dept.code,
        name: info.dept.name
      }
      setLocalStorage('selectedDept', selectedDept.value)
    }
  }

  return {
    systemTime,
    refreshTime,
    userInfo,
    selectedDept,
    changeSystemTime,
    changeRefreshTime,
    setUserInfo
  }
})
