<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/layout/AppHeader.vue'
import AppMain from '@/layout/AppMain.vue'
</script>

<template>
  <el-container class="w-100% h-100% overflow-hidden">
    <el-header class="p-0 overflow-hidden">
      <AppHeader />
    </el-header>
    <el-main class="p-0 overflow-hidden">
      <AppMain />
      <RouterView />
    </el-main>
  </el-container>
</template>
