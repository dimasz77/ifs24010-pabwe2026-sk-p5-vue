<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAucationsStore } from "../states/aucationsStore";
import { useUsersStore } from "../../users/states/usersStore";
import MarkdownViewer from "../components/MarkdownViewer.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import ChangeCoverModal from "../modals/ChangeCoverModal.vue";
import BidModal from "../modals/BidModal.vue";
import {
  formatDate,
  formatRupiah,
  isAucationClosed,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";

const route = useRoute();
const router = useRouter();
const store = useAucationsStore();
const usersStore = useUsersStore();
const errorMessage = ref("");
const changeModal = ref(null);
const coverModal = ref(null);
const bidModal = ref(null);

const id = computed(() => route.params.aucationId);
const bids = computed(() => store.aucation.bids ?? []);
const isOwner = computed(() => store.aucation.user_id === usersStore.profile?.id);

async function load() {
  errorMessage.value = "";
  try {
    await Promise.all([store.fetchAucation(id.value), usersStore.fetchProfile()]);
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function remove() {
  if (!(await showConfirmDialog("Hapus lelang ini?"))) return;
  try {
    await showSuccessDialog(await store.removeAucation(id.value));
    router.replace("/");
  } catch (error) {
    showErrorDialog(error.message);
  }
}

async function cancelBid() {
  try {
    await showSuccessDialog(await store.removeBid(id.value));
    await load();
  } catch (error) {
    showErrorDialog(error.message);
  }
}

onMounted(load);
</script>

<template>
  <RouterLink to="/" class="text-sm font-semibold text-indigo-700 underline">&larr; Kembali ke daftar</RouterLink>

  <p v-if="store.isAucation" role="status" class="mt-4 text-slate-700">Memuat data...</p>
  <article v-else-if="store.aucation && !errorMessage" class="mt-4 overflow-hidden rounded-xl bg-white shadow">
    <img
      v-if="store.aucation.cover"
      :src="store.aucation.cover"
      :alt="`Cover ${store.aucation.title}`"
      width="800"
      height="400"
      class="h-64 w-full object-cover"
    />
    <div class="p-6">
      <h1 class="text-2xl font-extrabold">{{ store.aucation.title }}</h1>
      <p class="mt-1 inline-block rounded px-2 py-0.5 text-xs font-bold"
        :class="isAucationClosed(store.aucation) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-900'">
        {{ isAucationClosed(store.aucation) ? "Ditutup" : "Berlangsung" }}
      </p>
      <MarkdownViewer class="mt-3" :content="store.aucation.description" />
      <p class="mt-3 text-sm text-slate-700">Harga awal: {{ formatRupiah(store.aucation.start_bid) }}</p>
      <p class="text-sm text-slate-700">Ditutup: {{ formatDate(store.aucation.closed_at) }}</p>

      <h2 class="mt-6 font-bold">Riwayat penawaran</h2>
      <ul class="mt-2 space-y-1 text-sm text-slate-700">
        <li v-for="item in bids" :key="item.id">
          {{ item.user.name }}: {{ formatRupiah(item.bid) }}
        </li>
        <li v-if="!bids.length">Belum ada penawaran.</li>
      </ul>

      <div class="mt-6 flex flex-wrap gap-2">
        <template v-if="isOwner">
          <button type="button" class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white" @click="changeModal.open()">
            Ubah lelang
          </button>
          <button type="button" class="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white" @click="coverModal.open()">
            Ganti cover
          </button>
          <button type="button" class="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white" @click="remove">
            Hapus lelang
          </button>
        </template>
        <template v-else>
          <button type="button" class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white" @click="bidModal.open()">
            Ajukan tawaran
          </button>
          <button type="button" class="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white" @click="cancelBid">
            Batalkan tawaran
          </button>
        </template>
      </div>
    </div>
    <ChangeModal ref="changeModal" :aucation="store.aucation" @changed="load" />
    <ChangeCoverModal ref="coverModal" :aucation-id="store.aucation.id" @changed="load" />
    <BidModal ref="bidModal" :aucation="store.aucation" @bid="load" />
  </article>
  <section v-else class="mt-4 rounded-xl bg-white p-6 shadow">
    <h1 class="text-2xl font-extrabold">Lelang tidak ditemukan</h1>
    <p role="alert" class="mt-2 text-slate-700">{{ errorMessage }}</p>
  </section>
</template>
