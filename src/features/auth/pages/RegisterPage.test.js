import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const api = vi.hoisted(() => ({ postLogin: vi.fn(), postRegister: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => dialogs);
vi.mock("../api/authApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import RegisterPage from "./RegisterPage.vue";

describe("RegisterPage", () => {
  beforeEach(() => vi.resetAllMocks());

  it("mendaftar lalu mengarahkan ke login", async () => {
    api.postRegister.mockResolvedValue({ message: "Terdaftar" });
    const { wrapper, router } = await renderWithProviders(RegisterPage, { route: "/auth/register" });
    expect(wrapper.find("h1").text()).toBe("Daftar Akun");

    await wrapper.find("#register-name-input").setValue("Ifs");
    await wrapper.find("#register-email-input").setValue("a@b.c");
    await wrapper.find("#register-password-input").setValue("123456");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(api.postRegister).toHaveBeenCalledWith({ name: "Ifs", email: "a@b.c", password: "123456" });
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Terdaftar");
    expect(router.currentRoute.value.path).toBe("/auth/login");
    wrapper.unmount();
  });

  it("menampilkan dialog error saat gagal", async () => {
    api.postRegister.mockRejectedValue(new Error("Email dipakai"));
    const { wrapper } = await renderWithProviders(RegisterPage, { route: "/auth/register" });
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Email dipakai");
    wrapper.unmount();
  });
});
