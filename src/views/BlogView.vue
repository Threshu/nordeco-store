<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main id="main-content" class="blog-view">
    <div class="container py-4">
      <h1>{{ t('blog.title') }}</h1>
      <p class="text-muted">{{ t('common.comingSoon') }}</p>
    </div>
  </main>
</template>
