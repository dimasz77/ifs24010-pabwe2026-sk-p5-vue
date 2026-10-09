<script setup>
defineProps({ open: { type: Boolean, default: false } });

const menus = [
  { to: "/", label: "Dashboard Lelang" },
  { to: "/?tab=me", label: "Lelang Saya" },
  { to: "/users", label: "Daftar Pengguna" },
  { to: "/profile", label: "Profil Saya" },
];
</script>

<template>
  <aside id="sidebar-menu" :class="open ? 'block' : 'hidden'" class="bg-indigo-50 md:block md:w-56 md:shrink-0">
    <nav aria-label="Menu lelang" class="flex flex-col gap-1 p-3 text-sm font-semibold">
      <RouterLink
        v-for="menu in menus"
        :key="menu.to"
        :to="menu.to"
        class="rounded-lg px-3 py-2 text-indigo-900 hover:bg-indigo-100"
        exact-active-class="bg-indigo-200"
      >
        {{ menu.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
