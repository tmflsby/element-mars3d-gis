<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/layout/AppHeader.vue'
</script>

<template>
  <div class="app-layout">
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.app-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-container {
    width: 100%;
    height: 100%;
    .el-header {
      padding: 0;
      z-index: 1;
    }
    .el-main {
      padding: 0;
    }
  }
}
</style>
