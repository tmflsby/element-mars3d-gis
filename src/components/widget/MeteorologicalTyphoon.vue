<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { ztq_service } from '@/api/ztq'

const selectValue = ref(
  'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10000}}}'
)
const selectOptions = [
  {
    label: '雷达拼图',
    options: [
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10000}}}',
        label: '福建拼图'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10011}}}',
        label: '全国拼图'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10010}}}',
        label: '华南拼图'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10013}}}',
        label: '华东拼图'
      }
    ]
  },
  {
    label: '单站雷达',
    options: [
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10005}}}',
        label: '三明'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10001}}}',
        label: '福州'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10002}}}',
        label: '龙岩'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10003}}}',
        label: '南平'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10004}}}',
        label: '厦门'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10006}}}',
        label: '泉州'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10009}}}',
        label: '漳州'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":10007}}}',
        label: '宁德'
      }
    ]
  },
  {
    label: '相控阵雷达',
    options: [
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":20001}}}',
        label: '福州'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":20002}}}',
        label: '厦门'
      },
      {
        value: 'leida#{"h":{"p":"10001-sanming"},"b":{"leida":{"count":"8","station_id":20003}}}',
        label: '泉州'
      }
    ]
  },
  {
    label: '卫星云图',
    options: [
      {
        value: 'wxyt#{"h":{"p":"10001-sanming"},"b":{"wxyt":{"count":"8","type":1}}}',
        label: '彩色云图'
      },
      {
        value: 'wxyt#{"h":{"p":"10001-sanming"},"b":{"wxyt":{"count":"8","type":9}}}',
        label: 'FY4A真彩色'
      },
      {
        value: 'wxyt#{"h":{"p":"10001-sanming"},"b":{"wxyt":{"count":"8","type":5}}}',
        label: '水汽云图'
      },
      {
        value: 'wxyt#{"h":{"p":"10001-sanming"},"b":{"wxyt":{"count":"8","type":4}}}',
        label: '可见光云图'
      },
      {
        value: 'wxyt#{"h":{"p":"10001-sanming"},"b":{"wxyt":{"count":"8","type":2}}}',
        label: '红外云图'
      }
    ]
  }
]

const imageUrl = ref('')
const imageUrlList = reactive([])

const getService = async () => {
  // 置空imageUrlList
  imageUrlList.splice(0, imageUrlList.length)

  const type = selectValue.value.split('#')[0]
  const param = selectValue.value.split('#')[1]

  const data = new FormData()
  data.append('p', param)

  const serviceRes = await ztq_service({}, data)
  switch (type) {
    case 'leida':
      for (let i = 0; i < serviceRes.b.leida.idex.length; i++) {
        const imageUrl = window.baseUrl.meteorologicalImage + serviceRes.b.leida.idex[i].img
        imageUrlList.push(imageUrl)
      }
      break
    case 'wxyt':
      for (let i = 0; i < serviceRes.b.wxyt.imgList.length; i++) {
        const imageUrl = window.baseUrl.meteorologicalImage + serviceRes.b.wxyt.imgList[i].url
        imageUrlList.push(imageUrl)
      }
      break
    default:
      break
  }
  imageUrl.value = imageUrlList[imageUrlList.length - 1]
}

onBeforeMount(() => {
  getService()
})
</script>

<template>
  <div class="meteorological-typhoon">
    <el-select filterable v-model="selectValue" @change="getService">
      <el-option-group v-for="group in selectOptions" :key="group.label" :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-option-group>
    </el-select>
    <el-image
      :src="imageUrl"
      :preview-src-list="imageUrlList"
      :initial-index="imageUrlList.length - 1"
      :infinite="false"
    />
  </div>
</template>

<style scoped lang="scss">
.meteorological-typhoon {
  width: 100%;
  height: 100%;
  :deep(.el-select) {
    width: 100%;
    margin-bottom: 10px;
  }
  :deep(.el-image) {
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
