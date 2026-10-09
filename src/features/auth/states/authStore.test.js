import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({ postLogin: vi.fn(), postRegister: vi.fn() }));
vi.mock("../api/authApi", () => api);

import { createMockPinia } from "../../../test-utils";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";
import { useAuthStore } from "./authStore";

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    createMockPinia();
  });

  it("membaca token awal dari localStorage", () => {
    putAccessToken("lama");
    const store = useAuthStore();
    expect(store.token).toBe("lama");
    expect(store.isAuthenticated).toBe(true);
  });

  it("login menyimpan token", async () => {
    api.postLogin.mockResolvedValue({ message: "Masuk", data: { token: "baru" } });
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);

    expect(await store.login({ email: "a" })).toBe("Masuk");

    expect(getAccessToken()).toBe("baru");
    expect(store.isAuthenticated).toBe(true);
    expect(store.isAuthLogin).toBe(false);
  });

  it("login yang gagal tetap mematikan status loading", async () => {
    api.postLogin.mockRejectedValue(new Error("salah"));
    const store = useAuthStore();
    await expect(store.login({})).rejects.toThrow("salah");
    expect(store.isAuthLogin).toBe(false);
  });

  it("register mengembalikan pesan", async () => {
    api.postRegister.mockResolvedValue({ message: "Terdaftar" });
    const store = useAuthStore();
    expect(await store.register({})).toBe("Terdaftar");
    expect(store.isAuthRegister).toBe(false);
  });

  it("register yang gagal tetap mematikan status loading", async () => {
    api.postRegister.mockRejectedValue(new Error("gagal"));
    const store = useAuthStore();
    await expect(store.register({})).rejects.toThrow("gagal");
    expect(store.isAuthRegister).toBe(false);
  });

  it("logout menghapus token", () => {
    putAccessToken("x");
    const store = useAuthStore();
    store.logout();
    expect(getAccessToken()).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthLogout).toBe(false);
  });
});
