<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";
import { showErrorDialog } from "../../../helpers/toolsHelper";

const store = useUsersStore();
onMounted(() => store.fetchUsers().catch((error) => showErrorDialog(error.message)));
</script>

<template>
  <h1 class="mb-4 text-2xl font-extrabold">Daftar Pengguna</h1>
  <p v-if="!store.users.length" class="text-slate-700">Belum ada pengguna.</p>
  <ul class="grid gap-3 sm:grid-cols-2">
    <li v-for="item in store.users" :key="item.id" class="rounded-xl bg-white p-4 shadow">
      <p class="font-bold">{{ item.name }}</p>
      <p class="text-sm text-slate-700">{{ item.email }}</p>
    </li>
  </ul>
</template>
