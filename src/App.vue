<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <div class="shell">
    <SiteHeader />
    <main class="main">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: var(--shell-max);
  margin: 0 auto;
  padding: 0 24px;
}
.main {
  flex: 1;
  padding: 48px 0 80px;
}
@media (max-width: 600px) {
  .shell {
    padding: 0 16px;
  }
  .main {
    padding: 32px 0 60px;
  }
}
</style>
