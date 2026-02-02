<script setup lang="ts">
import { computed, useSlots } from 'vue'

// ==============================================
// BaseCard - Universal card component
// ==============================================

export interface Props {
  /** Card variant */
  variant?: 'default' | 'outlined' | 'elevated'
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Make card clickable (adds hover effects) */
  clickable?: boolean
  /** Render as link */
  href?: string
  /** External link */
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  clickable: false,
  href: undefined,
  external: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()

const hasHeader = computed(() => !!slots.header)
const hasFooter = computed(() => !!slots.footer)
const hasImage = computed(() => !!slots.image)

const classes = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  `base-card--padding-${props.padding}`,
  {
    'base-card--clickable': props.clickable || props.href,
  },
])

const externalAttrs = computed(() =>
  props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
)
</script>

<template>
  <component :is="href ? 'a' : 'article'" :class="classes" :href="href" v-bind="externalAttrs">
    <!-- Image slot (no padding) -->
    <div v-if="hasImage" class="base-card__image">
      <slot name="image" />
    </div>

    <!-- Header slot -->
    <header v-if="hasHeader" class="base-card__header">
      <slot name="header" />
    </header>

    <!-- Default content slot -->
    <div class="base-card__body">
      <slot />
    </div>

    <!-- Footer slot -->
    <footer v-if="hasFooter" class="base-card__footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style lang="scss" scoped>
.base-card {
  display: flex;
  flex-direction: column;
  background-color: $color-white;
  border-radius: $border-radius;
  overflow: hidden;
  text-decoration: none;
  color: inherit;

  // Variants
  &--default {
    box-shadow: $shadow-sm;
  }

  &--outlined {
    border: 1px solid $border-color;
    box-shadow: none;
  }

  &--elevated {
    box-shadow: $shadow;
  }

  // Clickable state
  &--clickable {
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  // Padding variants
  &--padding-none {
    .base-card__header,
    .base-card__body,
    .base-card__footer {
      padding: 0;
    }
  }

  &--padding-sm {
    .base-card__header,
    .base-card__body,
    .base-card__footer {
      padding: 0.75rem;
    }
  }

  &--padding-md {
    .base-card__header,
    .base-card__body,
    .base-card__footer {
      padding: 1rem;
    }
  }

  &--padding-lg {
    .base-card__header,
    .base-card__body,
    .base-card__footer {
      padding: 1.5rem;
    }
  }

  // Card parts
  &__image {
    flex-shrink: 0;

    :deep(img) {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &__header {
    border-bottom: 1px solid $color-gray-200;
  }

  &__body {
    flex: 1;
  }

  &__footer {
    border-top: 1px solid $color-gray-200;
    margin-top: auto;
  }
}
</style>
