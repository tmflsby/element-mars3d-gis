<script setup>
import dayjs from 'dayjs'
import { onBeforeMount, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { text_getFldSituationText } from '@/api/text'
import { fileHanding_fileDownload } from '@/api/fileHanding'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept
const refreshTime = systemStore.refreshTime

const WPAdministrativeArea = window.WPD.get('WPAdministrativeArea')
const selectedRegion = WPAdministrativeArea.get(selectedDept.code)

const filePath = ref('')
const pdfUrl = ref('')
const pdfPreview = ref(false)

const getFldSituationText = async () => {
  const getFldSituationTextRes = await text_getFldSituationText({
    projectId,
    areaId: selectedRegion.id,
    type: selectedRegion.level,
    begin: dayjs(refreshTime).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime).format('YYYY-MM-DD HH:mm:ss')
  })
  console.log('getFldSituationTextRes', getFldSituationTextRes)
  filePath.value = decodeURIComponent(
    getFldSituationTextRes.headers['content-disposition'].split('=')[1].split('.pdf')[0]
  )
  pdfUrl.value = URL.createObjectURL(
    new Blob([getFldSituationTextRes.data], {
      type: 'application/pdf;charset-UTF-8'
    })
  )
}

const download = async () => {
  const fileDownloadRes = await fileHanding_fileDownload({
    filePath: `${filePath.value}.docx`
  })
  // console.log('fileDownloadRes', fileDownloadRes)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = URL.createObjectURL(fileDownloadRes.data)
  a.download = `${filePath.value}.docx`
  a.click()
  a.remove()
  ElMessage.success('下载成功！')
}

onBeforeMount(() => {
  getFldSituationText()
})

watch(
  () => refreshTime,
  () => {
    getFldSituationText()
  }
)
</script>

<template>
  <div class="rain-water-engineering-situation-summary">
    <div class="pdf-container">
      <iframe class="pdf" :src="pdfUrl" />
    </div>
    <div class="control">
      <el-button @click="pdfPreview = true">预览</el-button>
      <el-button @click="download">下载Word文档</el-button>
    </div>
    <el-dialog class="dialog" v-model="pdfPreview" title="预览文档">
      <iframe class="pdf" :src="pdfUrl" />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.rain-water-engineering-situation-summary {
  width: 100%;
  height: 100%;
  .pdf-container {
    width: 100%;
    height: calc(100% - 50px);
    .pdf {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  .control {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .dialog {
    .pdf {
      width: 100%;
      height: 60vh;
      border: none;
    }
  }
}
</style>
