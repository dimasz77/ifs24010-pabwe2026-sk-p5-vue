import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  getUsers: vi.fn(),
  getMe: vi.fn(),
  putMe: vi.fn(),
  postPhoto: vi.fn(),
  putPassword: vi.fn(),
}));
vi.mock("../api/userApi", () => api);

import { createMockPinia } from "../../../test-utils";
import { useUsersStore } from "./usersStore";

describe("usersStore", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    createMockPinia();
    api.getMe.mockResolvedValue({ data: { user: { id: 1, name: "Ifs" } } });
  });

  it("mengambil daftar pengguna", async () => {
    api.getUsers.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    const store = useUsersStore();
    await store.fetchUsers();
    expect(store.users).toEqual([{ id: 1 }]);
  });

  it("memakai array kosong jika data kosong", async () => {
    api.getUsers.mockResolvedValue({});
    const store = useUsersStore();
    await store.fetchUsers();
    expect(store.users).toEqual([]);
  });

  it("mengambil profil", async () => {
    const store = useUsersStore();
    await store.fetchProfile();
    expect(store.profile).toEqual({ id: 1, name: "Ifs" });
    expect(store.user).toEqual(store.profile);
  });

  it.each([
    ["changeProfile", "putMe", "isProfileChange", { name: "x" }],
    ["changePhoto", "postPhoto", "isPhotoChange", new FormData()],
    ["changePassword", "putPassword", "isPasswordChange", { password: "a" }],
  ])("%s memanggil API lalu memuat ulang profil", async (action, apiName, flag, payload) => {
    api[apiName].mockResolvedValue({ message: "Tersimpan" });
    const store = useUsersStore();

    expect(await store[action](payload)).toBe("Tersimpan");

    expect(api[apiName]).toHaveBeenCalledWith(payload);
    expect(api.getMe).toHaveBeenCalledTimes(1);
    expect(store[flag]).toBe(false);
  });

  it("mematikan flag saat mutasi gagal", async () => {
    api.putMe.mockRejectedValue(new Error("gagal"));
    const store = useUsersStore();
    await expect(store.changeProfile({})).rejects.toThrow("gagal");
    expect(store.isProfileChange).toBe(false);
  });
});
