<script setup>
import { computed } from "vue";

const props = defineProps({ content: { type: String, default: "" } });

// Renderer markdown ringan dan aman: hanya heading, daftar, dan paragraf.
// Teks dirender lewat interpolasi Vue sehingga tidak ada HTML mentah.
const blocks = computed(() =>
  props.content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      if (line.startsWith("# ")) return { type: "h2", text: line.slice(2) };
      if (line.startsWith("- ")) return { type: "li", text: line.slice(2) };
      return { type: "p", text: line };
    }),
);
</script>

<template>
  <div class="space-y-1 text-slate-700">
    <template v-for="(block, index) in blocks" :key="index">
      <h2 v-if="block.type === 'h2'" class="font-bold text-slate-900">{{ block.text }}</h2>
      <ul v-else-if="block.type === 'li'" class="list-inside list-disc">
        <li>{{ block.text }}</li>
      </ul>
      <p v-else>{{ block.text }}</p>
    </template>
  </div>
</template>
