<script setup>
import { ref } from "vue";
import ModalDialog from "./ModalDialog.vue";
import { useAucationsStore } from "../states/aucationsStore";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const props = defineProps({ aucationId: { type: [String, Number], required: true } });
const emit = defineEmits(["changed"]);
const store = useAucationsStore();
const dialog = ref(null);
const input = ref(null);
const preview = ref("");
defineExpose({ open: () => dialog.value.open() });

function onFile(event) {
  preview.value = URL.createObjectURL(event.target.files[0]);
}

async function submit() {
  const form = new FormData();
  form.append("cover", input.value.files[0]);
  try {
    const message = await store.changeCover(props.aucationId, form);
    dialog.value.close();
    await showSuccessDialog(message);
    emit("changed");
  } catch (error) {
    showErrorDialog(error.message);
  }
}
</script>

<template>
  <ModalDialog ref="dialog" title="Ganti Cover" title-id="cover-modal-title">
    <form class="space-y-3" @submit.prevent="submit">
      <div>
        <label for="cover-input" class="mb-1 block text-sm font-semibold text-slate-700">Pilih gambar cover</label>
        <input
          id="cover-input"
          ref="input"
          type="file"
          accept="image/*"
          required
          class="w-full rounded-lg border border-slate-400 px-3 py-2"
          @change="onFile"
        />
      </div>
      <img v-if="preview" :src="preview" alt="Pratinjau cover baru" width="320" height="180" class="h-40 w-full rounded-lg object-cover" />
      <div class="flex justify-end gap-2">
        <button type="button" class="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900" @click="dialog.close()">
          Batal
        </button>
        <button
          type="submit"
          :disabled="store.isAucationChangeCover"
          class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white disabled:opacity-70"
        >
          Unggah
        </button>
      </div>
    </form>
  </ModalDialog>
</template>
