<script setup>
import { ref } from "vue";
import ModalDialog from "./ModalDialog.vue";
import AucationForm from "./AucationForm.vue";
import { useAucationsStore } from "../states/aucationsStore";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const emit = defineEmits(["added"]);
const store = useAucationsStore();
const dialog = ref(null);
defineExpose({ open: () => dialog.value.open() });

async function submit(payload) {
  try {
    const message = await store.addAucation(payload);
    dialog.value.close();
    await showSuccessDialog(message);
    emit("added");
  } catch (error) {
    showErrorDialog(error.message);
  }
}
</script>

<template>
  <ModalDialog ref="dialog" title="Tambah Lelang" title-id="add-modal-title">
    <AucationForm
      id-prefix="add"
      :busy="store.isAucationAdd"
      @submit="submit"
      @cancel="dialog.close()"
    />
  </ModalDialog>
</template>
