<script setup lang="ts">
import { RouterView } from 'vue-router'
import SkipLink from '@/components/common/SkipLink.vue'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useLocaleHead } from '@/composables/useLocaleHead'

useLocaleHead()
</script>

<template>
  <div class="app">
    <SkipLink />
    <TheHeader />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <TheFooter />
  </div>
</template>
