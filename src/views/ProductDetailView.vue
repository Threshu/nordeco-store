<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const slug = route.params.slug as string
</script>

<template>
  <main id="main-content" class="product-detail-view">
    <div class="container py-4">
      <h1>{{ t('products.details') }}</h1>
      <p class="text-muted">{{ t('products.product') }}: {{ slug }}</p>
      <p class="text-muted">{{ t('common.comingSoon') }}</p>
    </div>
  </main>
</template>
