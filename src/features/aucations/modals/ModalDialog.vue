<script setup>
import { ref } from "vue";

defineProps({ title: { type: String, required: true }, titleId: { type: String, required: true } });

const dialog = ref(null);
const open = () => dialog.value.showModal();
const close = () => dialog.value.close();
defineExpose({ open, close });
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    class="m-auto w-full max-w-md rounded-2xl p-6 backdrop:bg-black/50"
  >
    <h2 :id="titleId" class="mb-4 text-xl font-extrabold">{{ title }}</h2>
    <slot />
  </dialog>
</template>
