<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main id="main-content" class="about-view">
    <div class="container py-4">
      <h1>{{ t('about.title') }}</h1>
      <p class="text-muted">{{ t('common.comingSoon') }}</p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.about-view {
  min-height: 50vh;
}
</style>
