<script setup lang="ts">
// ==============================================
// BaseErrorBoundary - Error boundary component
// ==============================================

import { ref, computed, onErrorCaptured } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: undefined,
  showDetails: import.meta.env.DEV,
  onError: undefined,
})

const { t } = useI18n()

export interface Props {
  /** Custom fallback message (overrides i18n) */
  fallbackMessage?: string
  /** Show error details (dev only) */
  showDetails?: boolean
  /** Callback when error occurs */
  onError?: (error: Error, info: string) => void
}

const errorTitle = computed(() => props.fallbackMessage ?? t('errors.general.title'))

const error = ref<Error | null>(null)
const errorInfo = ref<string>('')

const reset = () => {
  error.value = null
  errorInfo.value = ''
}

onErrorCaptured((err: Error, _instance, info: string) => {
  error.value = err
  errorInfo.value = info

  // Call optional error callback
  if (props.onError) {
    props.onError(err, info)
  }

  // Log error in development
  if (import.meta.env.DEV) {
    console.error('Error captured by BaseErrorBoundary:', err)
    console.error('Component info:', info)
  }

  // Prevent error from propagating
  return false
})
</script>

<template>
  <div v-if="error" class="base-error-boundary" role="alert">
    <div class="base-error-boundary__content">
      <svg
        class="base-error-boundary__icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <line
          x1="12"
          y1="8"
          x2="12"
          y2="12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>

      <h2 class="base-error-boundary__title">{{ errorTitle }}</h2>

      <p class="base-error-boundary__description">
        {{ t('errors.general.message') }}
      </p>

      <div v-if="showDetails && error" class="base-error-boundary__details">
        <details>
          <summary>{{ t('errors.general.details') }}</summary>
          <pre>{{ error.message }}</pre>
          <pre>{{ error.stack }}</pre>
          <pre>{{ errorInfo }}</pre>
        </details>
      </div>

      <button class="base-error-boundary__button" type="button" @click="reset">
        {{ t('common.retry') }}
      </button>
    </div>
  </div>

  <slot v-else />
</template>

<style lang="scss" scoped>
.base-error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
  text-align: center;

  &__content {
    max-width: 400px;
  }

  &__icon {
    width: 3rem;
    height: 3rem;
    color: $color-danger;
    margin-bottom: 1rem;
  }

  &__title {
    font-family: $font-family-heading;
    font-size: 1.25rem;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    margin: 0 0 0.5rem;
  }

  &__description {
    color: $text-secondary;
    font-size: $font-size-sm;
    margin: 0 0 1.5rem;
  }

  &__details {
    margin-bottom: 1.5rem;
    text-align: left;

    details {
      background-color: $color-gray-100;
      border-radius: $border-radius;
      padding: 0.75rem;

      summary {
        cursor: pointer;
        font-size: $font-size-sm;
        color: $text-secondary;
        margin-bottom: 0.5rem;
      }

      pre {
        font-size: 0.75rem;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
        margin: 0.5rem 0;
        padding: 0.5rem;
        background-color: $color-gray-200;
        border-radius: $border-radius-sm;
      }
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem;
    font-family: $font-family-base;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-white;
    background-color: $color-primary;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      background-color: $color-primary-dark;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }
}
</style>
