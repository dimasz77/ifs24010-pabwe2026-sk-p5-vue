<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";
import { useAuthStore } from "../../auth/states/authStore";

const auth = useAuthStore();
const router = useRouter();
const menuOpen = ref(false);

function logout() {
  auth.logout();
  router.replace("/auth/login");
}
</script>

<template>
  <NavbarComponent :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen" @logout="logout" />
  <div class="md:flex">
    <SidebarComponent :open="menuOpen" />
    <main class="mx-auto w-full max-w-5xl p-4"><RouterView /></main>
  </div>
</template>
