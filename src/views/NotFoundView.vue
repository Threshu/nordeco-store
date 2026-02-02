<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const { t } = useI18n()
</script>

<template>
  <main id="main-content" class="not-found-view">
    <div class="container">
      <div class="not-found-view__content">
        <span class="not-found-view__code">404</span>
        <h1 class="not-found-view__title">{{ t('errors.notFound.title') }}</h1>
        <p class="not-found-view__description">
          {{ t('errors.notFound.message') }}
        </p>
        <RouterLink to="/">
          <BaseButton variant="primary">{{ t('errors.notFound.backHome') }}</BaseButton>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;

  &__content {
    max-width: 400px;
  }

  &__code {
    display: block;
    font-family: $font-family-heading;
    font-size: 6rem;
    font-weight: $font-weight-bold;
    color: $color-gray-300;
    line-height: 1;
    margin-bottom: 1rem;
  }

  &__title {
    font-family: $font-family-heading;
    font-size: 1.75rem;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    margin: 0 0 0.75rem;
  }

  &__description {
    color: $text-secondary;
    margin: 0 0 2rem;
  }
}
</style>
