<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const locale = ref(zhCn)
const size = ref('large')
</script>

<template>
  <el-config-provider :locale="locale" :size="size">
    <RouterView />
  </el-config-provider>
</template>
