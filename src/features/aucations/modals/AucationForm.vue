<script setup>
import { ref } from "vue";
import MarkdownEditor from "../components/MarkdownEditor.vue";
import { useInput } from "../../../hooks/useInput";

const props = defineProps({
  idPrefix: { type: String, required: true },
  busy: { type: Boolean, default: false },
  initial: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["submit", "cancel"]);

const [title, onTitle] = useInput(props.initial.title ?? "");
const [startBid, onStartBid] = useInput(props.initial.start_bid ?? "");
const [closedAt, onClosedAt] = useInput(props.initial.closed_at?.slice(0, 16) ?? "");
const description = ref(props.initial.description ?? "");

const fieldClass = "w-full rounded-lg border border-slate-400 px-3 py-2";
const labelClass = "mb-1 block text-sm font-semibold text-slate-700";

function submit() {
  emit("submit", {
    title: title.value,
    description: description.value,
    start_bid: Number(startBid.value),
    closed_at: new Date(closedAt.value).toISOString(),
  });
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="submit">
    <div>
      <label :for="`${idPrefix}-title`" :class="labelClass">Judul</label>
      <input :id="`${idPrefix}-title`" required :value="title" :class="fieldClass" @input="onTitle" />
    </div>
    <MarkdownEditor :id="`${idPrefix}-desc`" v-model="description" />
    <div>
      <label :for="`${idPrefix}-bid`" :class="labelClass">Harga awal (Rp)</label>
      <input
        :id="`${idPrefix}-bid`"
        type="number"
        min="1"
        required
        :value="startBid"
        :class="fieldClass"
        @input="onStartBid"
      />
    </div>
    <div>
      <label :for="`${idPrefix}-closed`" :class="labelClass">Batas penutupan</label>
      <input
        :id="`${idPrefix}-closed`"
        type="datetime-local"
        required
        :value="closedAt"
        :class="fieldClass"
        @input="onClosedAt"
      />
    </div>
    <div class="flex justify-end gap-2">
      <button
        type="button"
        class="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900"
        @click="emit('cancel')"
      >
        Batal
      </button>
      <button
        type="submit"
        :disabled="busy"
        class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        Simpan
      </button>
    </div>
  </form>
</template>
