<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main id="main-content" class="home-view">
    <div class="container py-5">
      <section class="home-view__hero text-center mb-5">
        <h1 class="home-view__title">{{ t('home.hero.title') }}</h1>
        <p class="home-view__subtitle">
          {{ t('home.hero.subtitle') }}
        </p>
      </section>

      <section class="home-view__featured">
        <h2>{{ t('home.featured.title') }}</h2>
        <p class="text-muted">{{ t('common.comingSoon') }}</p>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.home-view {
  &__hero {
    padding: 3rem 0;
  }

  &__title {
    font-family: $font-family-heading;
    font-size: 2.5rem;
    font-weight: $font-weight-bold;
    color: $color-primary;
    margin-bottom: 1rem;

    @media (min-width: $breakpoint-md) {
      font-size: 3.5rem;
    }
  }

  &__subtitle {
    font-size: $font-size-lg;
    color: $text-secondary;
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
