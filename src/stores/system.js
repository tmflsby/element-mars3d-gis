import dayjs from 'dayjs'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useWPDStore } from '@/stores/wpd'

export const useSystemStore = defineStore(
  'system',
  () => {
    const systemTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
    const refreshTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
    const userInfo = ref({})
    const selectedDept = ref({})

    const wpdStore = useWPDStore()
    const WPDInitComplete = computed(() => wpdStore.WPDInitComplete)
    const selectedRegion = computed(() =>
      WPDInitComplete.value
        ? window.WPD.get('WPAdministrativeArea').get(selectedDept.value.code)
        : null
    )

    const changeSystemTime = (time) => {
      systemTime.value = time
    }
    const changeRefreshTime = (time) => {
      refreshTime.value = time
    }

    const setUserInfo = (info) => {
      userInfo.value = info
      selectedDept.value = {
        code: info.dept.code,
        name: info.dept.name
      }
    }

    return {
      systemTime,
      refreshTime,
      userInfo,
      selectedDept,
      selectedRegion,
      changeSystemTime,
      changeRefreshTime,
      setUserInfo
    }
  },
  {
    persist: {
      enabled: true,
      key: 'system',
      storage: localStorage,
      paths: ['userInfo', 'selectedDept']
    }
  }
)
