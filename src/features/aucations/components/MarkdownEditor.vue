<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  id: { type: String, required: true },
  label: { type: String, default: "Deskripsi (mendukung Markdown)" },
});
defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-semibold text-slate-700">{{ label }}</label>
    <textarea
      :id="id"
      required
      rows="5"
      :value="modelValue"
      class="w-full rounded-lg border border-slate-400 px-3 py-2 font-mono text-sm"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
  </div>
</template>
