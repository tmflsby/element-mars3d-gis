<script setup>
import dayjs from 'dayjs'
import { reactive, onBeforeMount } from 'vue'
import { weather_getTyphoonList } from '@/api/weather'

const tableData = reactive([])
const tableColumn = reactive([
  { title: '台风编号', field: 'num' },
  { title: '中文名', field: 'name_cn' },
  { title: '英文名', field: 'name_en' }
])
const getTyphoonList = async () => {
  const getTyphoonListRes = await weather_getTyphoonList({
    year: dayjs().year()
  })
  // console.log(getTyphoonListRes)
  if (getTyphoonListRes.code === 200 && getTyphoonListRes.success) {
    for (let i = 0; i < getTyphoonListRes.data.length; i++) {
      tableData.push({
        num: getTyphoonListRes.data[i].value,
        name_cn: getTyphoonListRes.data[i].text
          .split(' ')[0]
          .split(getTyphoonListRes.data[i].value)[1],
        name_en: getTyphoonListRes.data[i].text.split(' ')[1]
      })
    }
  }
}

onBeforeMount(() => {
  getTyphoonList()
})
</script>

<template>
  <div class="typhoon-info">
    <el-table :data="tableData" height="100%" style="width: 100%">
      <el-table-column
        v-for="item in tableColumn"
        :key="item.field"
        :prop="item.field"
        :label="item.title"
      />
    </el-table>
  </div>
</template>

<style scoped>
.typhoon-info {
  width: 100%;
  height: 100%;
}
</style>
