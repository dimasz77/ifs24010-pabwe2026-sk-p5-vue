import { ref } from "vue";

/** Composable untuk state input form beserta handler perubahannya. */
export function useInput(initialValue = "") {
  const value = ref(initialValue);
  const onChange = (event) => {
    value.value = event.target.value;
  };
  return [value, onChange];
}
