<script setup>
import { onMounted, ref, watch } from "vue";
import { useUsersStore } from "../states/usersStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const store = useUsersStore();
const [name, onName] = useInput("");
const [oldPassword, onOldPassword] = useInput("");
const [newPassword, onNewPassword] = useInput("");
const photo = ref(null);

watch(
  () => store.profile,
  (profile) => {
    name.value = profile.name;
  },
);

onMounted(() => store.fetchProfile().catch((error) => showErrorDialog(error.message)));

async function run(action) {
  try {
    await showSuccessDialog(await action());
  } catch (error) {
    showErrorDialog(error.message);
  }
}

const submitProfile = () => run(() => store.changeProfile({ name: name.value }));

const submitPassword = () =>
  run(() => store.changePassword({ password: oldPassword.value, new_password: newPassword.value }));

function submitPhoto() {
  const form = new FormData();
  form.append("photo", photo.value.files[0]);
  return run(() => store.changePhoto(form));
}
</script>

<template>
  <h1 class="mb-4 text-2xl font-extrabold">Profil Saya</h1>
  <p v-if="!store.profile" role="status" class="text-slate-700">Memuat profil...</p>
  <div v-else class="grid max-w-3xl gap-4 md:grid-cols-2">
    <section aria-labelledby="profile-heading" class="rounded-xl bg-white p-6 shadow">
      <h2 id="profile-heading" class="text-lg font-bold">Data akun</h2>
      <p class="mt-1 text-sm text-slate-700">Email: {{ store.profile.email }}</p>
      <form class="mt-4 space-y-3" @submit.prevent="submitProfile">
        <div>
          <label for="profile-name-input" class="mb-1 block text-sm font-semibold text-slate-700">Nama lengkap</label>
          <input
            id="profile-name-input"
            required
            :value="name"
            class="w-full rounded-lg border border-slate-400 px-3 py-2"
            @input="onName"
          />
        </div>
        <button
          type="submit"
          :disabled="store.isProfileChange"
          class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white disabled:opacity-70"
        >
          Simpan profil
        </button>
      </form>
    </section>

    <section aria-labelledby="photo-heading" class="rounded-xl bg-white p-6 shadow">
      <h2 id="photo-heading" class="text-lg font-bold">Foto profil</h2>
      <form class="mt-4 space-y-3" @submit.prevent="submitPhoto">
        <div>
          <label for="profile-photo-input" class="mb-1 block text-sm font-semibold text-slate-700">Pilih gambar</label>
          <input
            id="profile-photo-input"
            ref="photo"
            type="file"
            accept="image/*"
            required
            class="w-full rounded-lg border border-slate-400 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          :disabled="store.isPhotoChange"
          class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white disabled:opacity-70"
        >
          Unggah foto
        </button>
      </form>
    </section>

    <section aria-labelledby="password-heading" class="rounded-xl bg-white p-6 shadow md:col-span-2">
      <h2 id="password-heading" class="text-lg font-bold">Ubah kata sandi</h2>
      <form class="mt-4 grid gap-3 sm:grid-cols-2" @submit.prevent="submitPassword">
        <div>
          <label for="profile-old-password" class="mb-1 block text-sm font-semibold text-slate-700">Kata sandi lama</label>
          <input
            id="profile-old-password"
            type="password"
            autocomplete="current-password"
            required
            :value="oldPassword"
            class="w-full rounded-lg border border-slate-400 px-3 py-2"
            @input="onOldPassword"
          />
        </div>
        <div>
          <label for="profile-new-password" class="mb-1 block text-sm font-semibold text-slate-700">Kata sandi baru</label>
          <input
            id="profile-new-password"
            type="password"
            autocomplete="new-password"
            minlength="6"
            required
            :value="newPassword"
            class="w-full rounded-lg border border-slate-400 px-3 py-2"
            @input="onNewPassword"
          />
        </div>
        <div class="sm:col-span-2">
          <button
            type="submit"
            :disabled="store.isPasswordChange"
            class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white disabled:opacity-70"
          >
            Ubah kata sandi
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
