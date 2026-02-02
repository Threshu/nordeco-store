<script setup lang="ts">
// ==============================================
// BaseLoader - Loading spinner component
// ==============================================

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  overlay: false,
  label: undefined,
})

const { t } = useI18n()

export interface Props {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'light' | 'dark'
  /** Show as overlay (covers parent container) */
  overlay?: boolean
  /** Accessible label for screen readers (overrides i18n) */
  label?: string
}

const accessibleLabel = computed(() => props.label ?? t('common.loading'))

const classes = computed(() => [
  'base-loader',
  `base-loader--${props.size}`,
  `base-loader--${props.variant}`,
  {
    'base-loader--overlay': props.overlay,
  },
])
</script>

<template>
  <div :class="classes" role="status" :aria-label="accessibleLabel">
    <svg
      class="base-loader__spinner"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        class="base-loader__track"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        stroke-width="4"
      />
      <circle
        class="base-loader__indicator"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray="31.4 94.2"
      />
    </svg>
    <span class="sr-only">{{ accessibleLabel }}</span>
  </div>
</template>

<style lang="scss" scoped>
.base-loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // Sizes
  &--sm {
    .base-loader__spinner {
      width: 1rem;
      height: 1rem;
    }
  }

  &--md {
    .base-loader__spinner {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &--lg {
    .base-loader__spinner {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  &--xl {
    .base-loader__spinner {
      width: 4rem;
      height: 4rem;
    }
  }

  // Color variants
  &--primary {
    color: $color-primary;
  }

  &--secondary {
    color: $color-secondary;
  }

  &--light {
    color: $color-white;
  }

  &--dark {
    color: $color-gray-800;
  }

  // Overlay mode
  &--overlay {
    position: absolute;
    inset: 0;
    background-color: rgba($color-white, 0.8);
    z-index: $z-index-modal;
  }

  // Spinner elements
  &__spinner {
    animation: rotate 1.4s linear infinite;
  }

  &__track {
    opacity: 0.2;
  }

  &__indicator {
    animation: dash 1.4s ease-in-out infinite;
    transform-origin: center;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 125.6;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89.5, 125.6;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89.5, 125.6;
    stroke-dashoffset: -124;
  }
}
</style>
