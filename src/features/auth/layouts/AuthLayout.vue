<script setup>
const logoUrl = "/logo.svg";
</script>

<template>
  <main class="flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-6 flex flex-col items-center gap-2">
        <img :src="logoUrl" alt="Logo Delcom Auction" width="48" height="48" />
        <p class="text-lg font-bold text-indigo-700">Delcom Auction</p>
      </div>
      <RouterView />
    </div>
  </main>
</template>