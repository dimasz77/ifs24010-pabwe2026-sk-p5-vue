<script setup>
defineProps({ menuOpen: { type: Boolean, default: false } });
defineEmits(["toggle-menu", "logout"]);

const logoUrl = "/logo.svg";
</script>

<template>
  <header class="flex items-center justify-between bg-white px-4 py-3 shadow">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-lg bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-900 md:hidden"
        aria-controls="sidebar-menu"
        :aria-expanded="menuOpen"
        @click="$emit('toggle-menu')"
      >
        Menu
      </button>
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-indigo-700">
        <img :src="logoUrl" alt="" width="24" height="24" />
        Delcom Auction
      </RouterLink>
    </div>
    <button
      type="button"
      class="rounded-lg bg-indigo-700 px-3 py-1 text-sm font-semibold text-white"
      @click="$emit('logout')"
    >
      Keluar
    </button>
  </header>
</template>