<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import BaseLayout from './layout/BaseLayout.vue'
import { useThemeStore } from '@/store'

const themeStore = useThemeStore()
</script>

<template>
  <NConfigProvider :theme="themeStore.naiveTheme">
    <NDialogProvider>
      <NMessageProvider>
        <BaseLayout>
          <RouterView />
        </BaseLayout>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<style scoped></style>
