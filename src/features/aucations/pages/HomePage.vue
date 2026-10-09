<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAucationsStore } from "../states/aucationsStore";
import AddModal from "../modals/AddModal.vue";
import {
  formatDate,
  formatRupiah,
  getHighestBid,
  isAucationClosed,
  showErrorDialog,
} from "../../../helpers/toolsHelper";

const TABS = [
  { key: "all", label: "Semua Lelang", filter: {} },
  { key: "me", label: "Lelang Saya", filter: { is_me: 1 } },
  { key: "open", label: "Lelang Berlangsung", filter: { is_closed: 0 } },
  { key: "closed", label: "Lelang Ditutup", filter: { is_closed: 1 } },
];

const store = useAucationsStore();
const route = useRoute();
const router = useRouter();
const keyword = ref("");
const modal = ref(null);

const tab = computed(() => TABS.find((item) => item.key === route.query.tab) ?? TABS[0]);
const shown = computed(() => {
  const needle = keyword.value.toLowerCase();
  return store.aucations.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(needle));
});

const load = () => store.fetchAucations(tab.value.filter).catch((error) => showErrorDialog(error.message));
const selectTab = (key) => router.replace({ query: { tab: key } });

watch(tab, load);
onMounted(load);
</script>

<template>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
    <h1 class="text-2xl font-extrabold">Daftar Lelang</h1>
    <button
      type="button"
      class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white"
      @click="modal.open()"
    >
      Tambah lelang
    </button>
  </div>

  <div role="group" aria-label="Filter lelang" class="mb-3 flex flex-wrap gap-2">
    <button
      v-for="item in TABS"
      :key="item.key"
      type="button"
      :aria-pressed="tab.key === item.key"
      :class="tab.key === item.key ? 'bg-indigo-700 text-white' : 'bg-white text-slate-900'"
      class="rounded-lg px-3 py-1 text-sm font-semibold shadow"
      @click="selectTab(item.key)"
    >
      {{ item.label }}
    </button>
  </div>

  <label for="aucation-search" class="mb-1 block text-sm font-semibold text-slate-700">Cari judul atau deskripsi</label>
  <input
    id="aucation-search"
    v-model="keyword"
    type="search"
    class="mb-4 w-full rounded-lg border border-slate-400 px-3 py-2"
  />

  <p v-if="store.isAucation" role="status" class="text-slate-700">Memuat data...</p>
  <p v-else-if="!shown.length" class="text-slate-700">Belum ada lelang.</p>
  <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="item in shown" :key="item.id" class="overflow-hidden rounded-xl bg-white shadow">
      <img
        v-if="item.cover"
        :src="item.cover"
        :alt="`Cover ${item.title}`"
        width="400"
        height="200"
        loading="lazy"
        class="h-40 w-full object-cover"
      />
      <div v-else class="flex h-40 items-center justify-center bg-slate-200 text-sm text-slate-700">Tanpa cover</div>
      <div class="p-4">
        <h2 class="font-bold">
          <RouterLink :to="`/aucations/${item.id}`" class="text-indigo-700 underline">{{ item.title }}</RouterLink>
        </h2>
        <p class="mt-1 inline-block rounded px-2 py-0.5 text-xs font-bold"
          :class="isAucationClosed(item) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-900'">
          {{ isAucationClosed(item) ? "Ditutup" : "Berlangsung" }}
        </p>
        <p class="mt-1 text-sm text-slate-700">Harga awal: {{ formatRupiah(item.start_bid) }}</p>
        <p class="text-sm text-slate-700">Tawaran tertinggi: {{ formatRupiah(getHighestBid(item)) }}</p>
        <p class="text-sm text-slate-700">Ditutup: {{ formatDate(item.closed_at) }}</p>
      </div>
    </li>
  </ul>

  <AddModal ref="modal" @added="load" />
</template>
