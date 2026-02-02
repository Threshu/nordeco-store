<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ROUTE_NAMES } from '@/constants/routes'
import { useLocalizedRouter } from '@/composables/useLocalizedRouter'

// ==============================================
// TheHeader - Main navigation header
// ==============================================

const { t } = useI18n()
const { localePath } = useLocalizedRouter()

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const navLinks = computed(() => [
  { name: ROUTE_NAMES.HOME, label: t('nav.home'), to: localePath('home') },
  { name: ROUTE_NAMES.PRODUCTS, label: t('nav.products'), to: localePath('products') },
  { name: ROUTE_NAMES.BLOG, label: t('nav.blog'), to: localePath('blog') },
  { name: ROUTE_NAMES.ABOUT, label: t('nav.about'), to: localePath('about') },
  { name: ROUTE_NAMES.CONTACT, label: t('nav.contact'), to: localePath('contact') },
])
</script>

<template>
  <header class="the-header">
    <div class="container">
      <div class="the-header__inner">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="the-header__logo"
          :aria-label="`Nordeco Store - ${t('nav.home')}`"
        >
          <span class="the-header__logo-text">Nordeco</span>
          <span class="the-header__logo-accent">Store</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="the-header__nav" :aria-label="t('a11y.mainNav')">
          <ul class="the-header__nav-list">
            <li v-for="link in navLinks" :key="link.name" class="the-header__nav-item">
              <RouterLink
                :to="link.to"
                class="the-header__nav-link"
                active-class="the-header__nav-link--active"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Actions (Cart, Theme toggle) -->
        <div class="the-header__actions">
          <!-- Cart button placeholder -->
          <RouterLink
            :to="localePath('cart')"
            class="the-header__action-btn"
            :aria-label="t('nav.cart')"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </RouterLink>

          <!-- Mobile menu toggle -->
          <button
            class="the-header__menu-toggle"
            type="button"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-menu"
            :aria-label="isMenuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')"
            @click="toggleMenu"
          >
            <span
              class="the-header__menu-icon"
              :class="{ 'the-header__menu-icon--open': isMenuOpen }"
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <Transition name="slide-down">
      <nav
        v-show="isMenuOpen"
        id="mobile-menu"
        class="the-header__mobile-nav"
        :aria-label="t('a11y.mobileNav')"
      >
        <ul class="the-header__mobile-list">
          <li v-for="link in navLinks" :key="link.name" class="the-header__mobile-item">
            <RouterLink
              :to="link.to"
              class="the-header__mobile-link"
              active-class="the-header__mobile-link--active"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.the-header {
  position: sticky;
  top: 0;
  z-index: $z-index-sticky;
  background-color: $color-white;
  border-bottom: 1px solid $color-gray-200;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    gap: 1.5rem;
  }

  // Logo
  &__logo {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    text-decoration: none;
    font-family: $font-family-heading;
    font-size: 1.5rem;
    font-weight: $font-weight-bold;

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 4px;
    }
  }

  &__logo-text {
    color: $color-primary;
  }

  &__logo-accent {
    color: $color-secondary;
    font-weight: $font-weight-normal;
  }

  // Desktop Navigation
  &__nav {
    display: none;

    @media (min-width: $breakpoint-lg) {
      display: block;
    }
  }

  &__nav-list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__nav-link {
    display: block;
    padding: 0.5rem 1rem;
    color: $text-primary;
    text-decoration: none;
    font-weight: $font-weight-medium;
    border-radius: $border-radius;
    transition: $transition-fast;

    &:hover {
      color: $color-primary;
      background-color: rgba($color-primary, 0.05);
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }

    &--active {
      color: $color-primary;
      background-color: rgba($color-primary, 0.1);
    }
  }

  // Actions
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    color: $text-primary;
    background: none;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: $transition-fast;

    &:hover {
      color: $color-primary;
      background-color: rgba($color-primary, 0.05);
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  // Mobile menu toggle
  &__menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;

    @media (min-width: $breakpoint-lg) {
      display: none;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__menu-icon {
    position: relative;
    width: 1.25rem;
    height: 1rem;

    span {
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: $text-primary;
      border-radius: 1px;
      transition: $transition-fast;

      &:nth-child(1) {
        top: 0;
      }

      &:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
      }

      &:nth-child(3) {
        bottom: 0;
      }
    }

    &--open span {
      &:nth-child(1) {
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        bottom: 50%;
        transform: translateY(50%) rotate(-45deg);
      }
    }
  }

  // Mobile Navigation
  &__mobile-nav {
    border-top: 1px solid $color-gray-200;
    background-color: $color-white;

    @media (min-width: $breakpoint-lg) {
      display: none;
    }
  }

  &__mobile-list {
    list-style: none;
    margin: 0;
    padding: 0.5rem 0;
  }

  &__mobile-link {
    display: block;
    padding: 0.75rem 1.5rem;
    color: $text-primary;
    text-decoration: none;
    font-weight: $font-weight-medium;
    transition: $transition-fast;

    &:hover {
      color: $color-primary;
      background-color: rgba($color-primary, 0.05);
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: -2px;
    }

    &--active {
      color: $color-primary;
      background-color: rgba($color-primary, 0.1);
    }
  }
}

// Slide down transition
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
