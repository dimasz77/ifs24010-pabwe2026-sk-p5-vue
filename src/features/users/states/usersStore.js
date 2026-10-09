import { defineStore } from "pinia";
import { ref } from "vue";
import { getMe, getUsers, postPhoto, putMe, putPassword } from "../api/userApi";
import { unwrap } from "../../../helpers/apiHelper";

export const useUsersStore = defineStore("users", () => {
  const users = ref([]);
  const user = ref(null);
  const profile = ref(null);
  const isProfileChange = ref(false);
  const isPhotoChange = ref(false);
  const isPasswordChange = ref(false);

  async function fetchUsers() {
    users.value = unwrap(await getUsers(), "users") ?? [];
  }

  async function fetchProfile() {
    profile.value = user.value = unwrap(await getMe(), "user");
  }

  async function mutate(flag, call) {
    flag.value = true;
    try {
      const json = await call();
      await fetchProfile();
      return json.message;
    } finally {
      flag.value = false;
    }
  }

  const changeProfile = (body) => mutate(isProfileChange, () => putMe(body));
  const changePhoto = (form) => mutate(isPhotoChange, () => postPhoto(form));
  const changePassword = (body) => mutate(isPasswordChange, () => putPassword(body));

  return {
    users, user, profile,
    isProfileChange, isPhotoChange, isPasswordChange,
    fetchUsers, fetchProfile, changeProfile, changePhoto, changePassword,
  };
});
