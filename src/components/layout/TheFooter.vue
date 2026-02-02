<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { useLocalizedRouter } from '@/composables/useLocalizedRouter'

// ==============================================
// TheFooter - Main footer component
// ==============================================

const { t } = useI18n()
const { localePath } = useLocalizedRouter()

const currentYear = new Date().getFullYear()

const footerLinks = computed(() => ({
  shop: [
    { label: t('footer.allProducts'), to: localePath('products') },
    { label: t('footer.newArrivals'), to: `${localePath('products')}?sort=newest` },
    { label: t('footer.bestsellers'), to: `${localePath('products')}?sort=popular` },
    { label: t('footer.sale'), to: `${localePath('products')}?sale=true` },
  ],
  company: [
    { label: t('nav.about'), to: localePath('about') },
    { label: t('nav.blog'), to: localePath('blog') },
    { label: t('nav.contact'), to: localePath('contact') },
    { label: t('footer.careers'), to: localePath('careers') },
  ],
  help: [
    { label: t('footer.faq'), to: localePath('faq') },
    { label: t('footer.shipping'), to: localePath('shipping') },
    { label: t('footer.returns'), to: localePath('returns') },
    { label: t('footer.terms'), to: localePath('terms') },
  ],
}))

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
]
</script>

<template>
  <footer class="the-footer">
    <div class="container">
      <div class="the-footer__grid">
        <!-- Brand column -->
        <div class="the-footer__brand">
          <RouterLink
            :to="localePath('home')"
            class="the-footer__logo"
            :aria-label="`Nordeco Store - ${t('nav.home')}`"
          >
            <span class="the-footer__logo-text">Nordeco</span>
            <span class="the-footer__logo-accent">Store</span>
          </RouterLink>
          <p class="the-footer__description">
            {{ t('footer.description') }}
          </p>

          <!-- Social links -->
          <div class="the-footer__social">
            <a
              v-for="social in socialLinks"
              :key="social.icon"
              :href="social.href"
              class="the-footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
            >
              <!-- Facebook icon -->
              <svg
                v-if="social.icon === 'facebook'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <!-- Instagram icon -->
              <svg
                v-if="social.icon === 'instagram'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <!-- Twitter icon -->
              <svg
                v-if="social.icon === 'twitter'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Links columns -->
        <nav class="the-footer__nav" :aria-label="t('footer.shop')">
          <h3 class="the-footer__nav-title">{{ t('footer.shop') }}</h3>
          <ul class="the-footer__nav-list">
            <li v-for="link in footerLinks.shop" :key="link.to">
              <RouterLink :to="link.to" class="the-footer__nav-link">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <nav class="the-footer__nav" :aria-label="t('footer.company')">
          <h3 class="the-footer__nav-title">{{ t('footer.company') }}</h3>
          <ul class="the-footer__nav-list">
            <li v-for="link in footerLinks.company" :key="link.to">
              <RouterLink :to="link.to" class="the-footer__nav-link">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <nav class="the-footer__nav" :aria-label="t('footer.help')">
          <h3 class="the-footer__nav-title">{{ t('footer.help') }}</h3>
          <ul class="the-footer__nav-list">
            <li v-for="link in footerLinks.help" :key="link.to">
              <RouterLink :to="link.to" class="the-footer__nav-link">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Bottom bar -->
      <div class="the-footer__bottom">
        <p class="the-footer__copyright">
          {{ t('footer.copyright', { year: currentYear }) }}
        </p>
        <div class="the-footer__legal">
          <RouterLink :to="localePath('privacy')" class="the-footer__legal-link">
            {{ t('footer.privacy') }}
          </RouterLink>
          <RouterLink :to="localePath('terms')" class="the-footer__legal-link">{{
            t('footer.terms')
          }}</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.the-footer {
  background-color: $color-gray-900;
  color: $color-gray-300;
  padding: 3rem 0 1.5rem;
  margin-top: auto;

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: 2fr 1fr 1fr 1fr;
    }
  }

  // Brand
  &__brand {
    max-width: 280px;
  }

  &__logo {
    display: inline-flex;
    align-items: baseline;
    gap: 0.25rem;
    text-decoration: none;
    font-family: $font-family-heading;
    font-size: 1.25rem;
    font-weight: $font-weight-bold;
    margin-bottom: 1rem;

    &:focus-visible {
      outline: 2px solid $color-primary-light;
      outline-offset: 4px;
    }
  }

  &__logo-text {
    color: $color-white;
  }

  &__logo-accent {
    color: $color-accent;
    font-weight: $font-weight-normal;
  }

  &__description {
    font-size: $font-size-sm;
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }

  // Social
  &__social {
    display: flex;
    gap: 0.75rem;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    color: $color-gray-400;
    background-color: $color-gray-800;
    border-radius: $border-radius;
    transition: $transition-fast;

    &:hover {
      color: $color-white;
      background-color: $color-primary;
    }

    &:focus-visible {
      outline: 2px solid $color-primary-light;
      outline-offset: 2px;
    }
  }

  // Navigation
  &__nav-title {
    font-family: $font-family-base;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-white;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 1rem;
  }

  &__nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__nav-link {
    display: inline-block;
    padding: 0.25rem 0;
    color: $color-gray-400;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: $transition-fast;

    &:hover {
      color: $color-white;
    }

    &:focus-visible {
      outline: 2px solid $color-primary-light;
      outline-offset: 2px;
    }
  }

  // Bottom bar
  &__bottom {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid $color-gray-800;

    @media (min-width: $breakpoint-md) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__copyright {
    font-size: $font-size-sm;
    margin: 0;
  }

  &__legal {
    display: flex;
    gap: 1.5rem;
  }

  &__legal-link {
    color: $color-gray-400;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: $transition-fast;

    &:hover {
      color: $color-white;
    }

    &:focus-visible {
      outline: 2px solid $color-primary-light;
      outline-offset: 2px;
    }
  }
}
</style>
