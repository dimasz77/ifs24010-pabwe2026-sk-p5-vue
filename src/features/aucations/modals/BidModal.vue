<script setup>
import { ref } from "vue";
import ModalDialog from "./ModalDialog.vue";
import { useAucationsStore } from "../states/aucationsStore";
import { useInput } from "../../../hooks/useInput";
import { formatRupiah, getHighestBid, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const props = defineProps({ aucation: { type: Object, required: true } });
const emit = defineEmits(["bid"]);
const store = useAucationsStore();
const dialog = ref(null);
const [bid, onBid] = useInput("");
const errorMessage = ref("");
defineExpose({ open: () => dialog.value.open() });

async function submit() {
  const highest = getHighestBid(props.aucation);
  if (Number(bid.value) <= highest) {
    errorMessage.value = `Penawaran harus lebih tinggi dari ${formatRupiah(highest)}`;
    return;
  }
  errorMessage.value = "";
  try {
    const message = await store.addBid(props.aucation.id, { bid: Number(bid.value) });
    dialog.value.close();
    bid.value = "";
    await showSuccessDialog(message);
    emit("bid");
  } catch (error) {
    showErrorDialog(error.message);
  }
}
</script>

<template>
  <ModalDialog ref="dialog" title="Ajukan Penawaran" title-id="bid-modal-title">
    <form class="space-y-3" @submit.prevent="submit">
      <div>
        <label for="bid-input" class="mb-1 block text-sm font-semibold text-slate-700">Nominal penawaran (Rp)</label>
        <input
          id="bid-input"
          type="number"
          min="1"
          required
          :value="bid"
          :aria-describedby="errorMessage ? 'bid-error' : undefined"
          class="w-full rounded-lg border border-slate-400 px-3 py-2"
          @input="onBid"
        />
        <p v-if="errorMessage" id="bid-error" role="alert" class="mt-1 text-sm font-semibold text-red-700">
          {{ errorMessage }}
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" class="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900" @click="dialog.close()">
          Batal
        </button>
        <button
          type="submit"
          :disabled="store.isBidAdd"
          class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white disabled:opacity-70"
        >
          Ajukan tawaran
        </button>
      </div>
    </form>
  </ModalDialog>
</template>
