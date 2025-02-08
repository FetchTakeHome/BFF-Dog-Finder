<template>
  <div class="min-h-screen bg-slate-800">
    <ClientOnly>
      <Navbar />
      <UNotifications />
      <NuxtLayout>
        <NuxtPage class="page" />
      </NuxtLayout>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
