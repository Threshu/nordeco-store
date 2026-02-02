<script setup lang="ts">
// ==============================================
// SkipLink - Accessibility skip navigation
// ==============================================

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<Props>(), {
  targetId: 'main-content',
  label: undefined,
})

const { t } = useI18n()

export interface Props {
  /** Target element ID to skip to */
  targetId?: string
  /** Link text (overrides i18n) */
  label?: string
}

const linkLabel = computed(() => props.label ?? t('a11y.skipLink'))
</script>

<template>
  <a :href="`#${targetId}`" class="skip-link">
    {{ linkLabel }}
  </a>
</template>

<style lang="scss" scoped>
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: $z-index-tooltip;
  padding: 0.75rem 1rem;
  background-color: $color-primary;
  color: $color-white;
  font-weight: $font-weight-medium;
  text-decoration: none;
  border-radius: 0 0 $border-radius $border-radius;
  transition: top 0.2s ease;

  &:focus {
    top: 0;
    outline: 2px solid $color-primary-dark;
    outline-offset: 2px;
  }
}
</style>
