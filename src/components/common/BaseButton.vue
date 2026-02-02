<script setup lang="ts">
import { computed } from 'vue'

// ==============================================
// BaseButton - Universal button with variants
// ==============================================

export interface Props {
  /** Button variant (style) */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Full width button */
  block?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Loading state (shows spinner) */
  loading?: boolean
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
  /** Render as link (uses <a> tag) */
  href?: string
  /** External link (adds rel="noopener noreferrer") */
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
  loading: false,
  type: 'button',
  href: undefined,
  external: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--block': props.block,
    'base-button--loading': props.loading,
    'base-button--disabled': isDisabled.value,
  },
])

const externalAttrs = computed(() =>
  props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :class="classes"
    :href="href"
    :type="href ? undefined : type"
    :disabled="href ? undefined : isDisabled"
    :aria-disabled="isDisabled"
    :aria-busy="loading"
    v-bind="externalAttrs"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true">
      <svg
        class="base-button__spinner-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="31.4 31.4"
        />
      </svg>
    </span>
    <span class="base-button__content" :class="{ 'base-button__content--hidden': loading }">
      <slot />
    </span>
  </component>
</template>

<style lang="scss" scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: $font-family-base;
  font-weight: $font-weight-medium;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: $border-radius;
  cursor: pointer;
  transition: $transition-base;
  position: relative;

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  // Sizes
  &--sm {
    padding: 0.375rem 0.75rem;
    font-size: $font-size-sm;
  }

  &--md {
    padding: 0.625rem 1.25rem;
    font-size: $font-size-base;
  }

  &--lg {
    padding: 0.875rem 1.75rem;
    font-size: $font-size-lg;
  }

  // Variants
  &--primary {
    background-color: $color-primary;
    color: $color-white;
    border-color: $color-primary;

    &:hover:not(.base-button--disabled) {
      background-color: $color-primary-dark;
      border-color: $color-primary-dark;
    }
  }

  &--secondary {
    background-color: $color-secondary;
    color: $color-white;
    border-color: $color-secondary;

    &:hover:not(.base-button--disabled) {
      background-color: $color-secondary-dark;
      border-color: $color-secondary-dark;
    }
  }

  &--outline {
    background-color: transparent;
    color: $color-primary;
    border-color: $color-primary;

    &:hover:not(.base-button--disabled) {
      background-color: $color-primary;
      color: $color-white;
    }
  }

  &--ghost {
    background-color: transparent;
    color: $color-primary;
    border-color: transparent;

    &:hover:not(.base-button--disabled) {
      background-color: rgba($color-primary, 0.1);
    }
  }

  &--danger {
    background-color: $color-danger;
    color: $color-white;
    border-color: $color-danger;

    &:hover:not(.base-button--disabled) {
      background-color: darken($color-danger, 10%);
      border-color: darken($color-danger, 10%);
    }
  }

  // States
  &--block {
    display: flex;
    width: 100%;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--loading {
    cursor: wait;
  }

  // Content
  &__content {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &--hidden {
      visibility: hidden;
    }
  }

  // Spinner
  &__spinner {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__spinner-icon {
    width: 1.25em;
    height: 1.25em;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
