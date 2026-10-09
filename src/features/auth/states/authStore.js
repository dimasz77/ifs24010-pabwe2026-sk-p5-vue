import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { postLogin, postRegister } from "../api/authApi";
import { getAccessToken, putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(getAccessToken());
  const isAuthLogin = ref(false);
  const isAuthRegister = ref(false);
  const isAuthLogout = ref(false);
  const isAuthenticated = computed(() => Boolean(token.value));

  async function login(payload) {
    isAuthLogin.value = true;
    try {
      const json = await postLogin(payload);
      token.value = json.data.token;
      putAccessToken(token.value);
      return json.message;
    } finally {
      isAuthLogin.value = false;
    }
  }

  async function register(payload) {
    isAuthRegister.value = true;
    try {
      return (await postRegister(payload)).message;
    } finally {
      isAuthRegister.value = false;
    }
  }

  function logout() {
    isAuthLogout.value = true;
    removeAccessToken();
    token.value = null;
    isAuthLogout.value = false;
  }

  return { token, isAuthLogin, isAuthRegister, isAuthLogout, isAuthenticated, login, register, logout };
});
