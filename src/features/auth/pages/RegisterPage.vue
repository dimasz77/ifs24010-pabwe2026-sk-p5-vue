<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const auth = useAuthStore();
const router = useRouter();
const [name, onName] = useInput("");
const [email, onEmail] = useInput("");
const [password, onPassword] = useInput("");

async function submit() {
  try {
    const message = await auth.register({ name: name.value, email: email.value, password: password.value });
    await showSuccessDialog(message);
    router.replace("/auth/login");
  } catch (error) {
    showErrorDialog(error.message);
  }
}
</script>

<template>
  <h1 class="mb-6 text-center text-2xl font-extrabold">Daftar Akun</h1>
  <form class="space-y-4" @submit.prevent="submit">
    <div>
      <label for="register-name-input" class="mb-1 block text-sm font-semibold text-slate-700">Nama lengkap</label>
      <input
        id="register-name-input"
        autocomplete="name"
        required
        :value="name"
        class="w-full rounded-lg border border-slate-400 px-3 py-2"
        @input="onName"
      />
    </div>
    <div>
      <label for="register-email-input" class="mb-1 block text-sm font-semibold text-slate-700">Alamat email</label>
      <input
        id="register-email-input"
        type="email"
        autocomplete="email"
        required
        :value="email"
        class="w-full rounded-lg border border-slate-400 px-3 py-2"
        @input="onEmail"
      />
    </div>
    <div>
      <label for="register-password-input" class="mb-1 block text-sm font-semibold text-slate-700">Kata sandi</label>
      <input
        id="register-password-input"
        type="password"
        autocomplete="new-password"
        minlength="6"
        required
        :value="password"
        class="w-full rounded-lg border border-slate-400 px-3 py-2"
        @input="onPassword"
      />
    </div>
    <button
      type="submit"
      :disabled="auth.isAuthRegister"
      class="w-full rounded-lg bg-indigo-700 py-2 font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
    >
      Daftar sekarang
    </button>
  </form>
  <p class="mt-4 text-center text-sm text-slate-700">
    Sudah punya akun?
    <RouterLink to="/auth/login" class="font-semibold text-indigo-700 underline">Masuk</RouterLink>
  </p>
</template>
