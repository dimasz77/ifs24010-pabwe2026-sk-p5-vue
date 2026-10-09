import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn() }));
const api = vi.hoisted(() => ({ postLogin: vi.fn(), postRegister: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => dialogs);
vi.mock("../api/authApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import LoginPage from "./LoginPage.vue";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("menampilkan formulir dengan label yang terhubung", async () => {
    const { wrapper } = await renderWithProviders(LoginPage, { route: "/auth/login" });
    expect(wrapper.find("h1").text()).toBe("Masuk Akun");
    expect(wrapper.find('label[for="login-email-input"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/auth/register"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("login berhasil lalu pindah ke beranda", async () => {
    api.postLogin.mockResolvedValue({ message: "ok", data: { token: "t" } });
    const { wrapper, router } = await renderWithProviders(LoginPage, { route: "/auth/login" });

    await wrapper.find("#login-email-input").setValue("a@b.c");
    await wrapper.find("#login-password-input").setValue("rahasia");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(api.postLogin).toHaveBeenCalledWith({ email: "a@b.c", password: "rahasia" });
    expect(router.currentRoute.value.path).toBe("/");
    wrapper.unmount();
  });

  it("menampilkan dialog error saat login gagal", async () => {
    api.postLogin.mockRejectedValue(new Error("Email salah"));
    const { wrapper } = await renderWithProviders(LoginPage, { route: "/auth/login" });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Email salah");
    wrapper.unmount();
  });
});
