<script setup lang="ts">
// ==============================================
// BaseSkeleton - Skeleton loader for content
// ==============================================

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: undefined,
  variant: 'text',
  animation: 'pulse',
  lines: 1,
})

const { t } = useI18n()

export interface Props {
  /** Width of skeleton (CSS value) */
  width?: string
  /** Height of skeleton (CSS value) */
  height?: string
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none'
  /** Number of lines (for text variant) */
  lines?: number
}

const classes = computed(() => [
  'base-skeleton',
  `base-skeleton--${props.variant}`,
  `base-skeleton--${props.animation}`,
])

const style = computed(() => ({
  width: props.width,
  height: props.height || (props.variant === 'text' ? '1em' : undefined),
}))

const lineWidths = computed(() => {
  if (props.lines <= 1) return [props.width]

  // Vary line widths for more natural look
  return Array.from({ length: props.lines }, (_, i) => {
    if (i === props.lines - 1) return '60%' // Last line shorter
    return '100%'
  })
})
</script>

<template>
  <div
    v-if="lines > 1"
    class="base-skeleton__lines"
    role="status"
    :aria-label="t('common.loading')"
  >
    <span
      v-for="(lineWidth, index) in lineWidths"
      :key="index"
      :class="classes"
      :style="{ ...style, width: lineWidth }"
      aria-hidden="true"
    />
    <span class="sr-only">{{ t('common.loading') }}</span>
  </div>
  <span v-else :class="classes" :style="style" role="status" :aria-label="t('common.loading')">
    <span class="sr-only">{{ t('common.loading') }}</span>
  </span>
</template>

<style lang="scss" scoped>
.base-skeleton {
  display: block;
  background-color: $color-gray-200;

  // Variants
  &--text {
    border-radius: $border-radius-sm;
    transform-origin: 0 55%;
  }

  &--circular {
    border-radius: 50%;
  }

  &--rectangular {
    border-radius: 0;
  }

  &--rounded {
    border-radius: $border-radius;
  }

  // Animations
  &--pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }

  &--wave {
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba($color-white, 0.4), transparent);
      animation: wave 1.5s linear infinite;
    }
  }

  &--none {
    animation: none;
  }

  // Lines container
  &__lines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes wave {
  100% {
    transform: translateX(100%);
  }
}
</style>
