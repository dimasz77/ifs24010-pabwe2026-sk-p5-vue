<script setup>
import { ref } from "vue";
import ModalDialog from "./ModalDialog.vue";
import AucationForm from "./AucationForm.vue";
import { useAucationsStore } from "../states/aucationsStore";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const props = defineProps({ aucation: { type: Object, required: true } });
const emit = defineEmits(["changed"]);
const store = useAucationsStore();
const dialog = ref(null);
defineExpose({ open: () => dialog.value.open() });

async function submit(payload) {
  try {
    const message = await store.changeAucation(props.aucation.id, payload);
    dialog.value.close();
    await showSuccessDialog(message);
    emit("changed");
  } catch (error) {
    showErrorDialog(error.message);
  }
}
</script>

<template>
  <ModalDialog ref="dialog" title="Ubah Lelang" title-id="change-modal-title">
    <AucationForm
      id-prefix="change"
      :initial="aucation"
      :busy="store.isAucationChange"
      @submit="submit"
      @cancel="dialog.close()"
    />
  </ModalDialog>
</template>
