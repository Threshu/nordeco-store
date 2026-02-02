<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const slug = route.params.slug as string
</script>

<template>
  <main id="main-content" class="blog-post-view">
    <div class="container py-4">
      <h1>{{ t('blog.article') }}</h1>
      <p class="text-muted">{{ t('blog.post') }}: {{ slug }}</p>
      <p class="text-muted">{{ t('common.comingSoon') }}</p>
    </div>
  </main>
</template>
