import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn() }));
const api = vi.hoisted(() => ({ getUsers: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => dialogs);
vi.mock("../api/userApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import UsersPage from "./UsersPage.vue";

describe("UsersPage", () => {
  beforeEach(() => vi.resetAllMocks());

  it("menampilkan daftar pengguna", async () => {
    api.getUsers.mockResolvedValue({ data: { users: [{ id: 1, name: "Ifs", email: "i@d.id" }] } });
    const { wrapper } = await renderWithProviders(UsersPage);
    expect(wrapper.text()).toContain("Ifs");
    expect(wrapper.text()).toContain("i@d.id");
    expect(wrapper.text()).not.toContain("Belum ada pengguna");
    wrapper.unmount();
  });

  it("menampilkan keadaan kosong", async () => {
    api.getUsers.mockResolvedValue({ data: { users: [] } });
    const { wrapper } = await renderWithProviders(UsersPage);
    expect(wrapper.text()).toContain("Belum ada pengguna");
    wrapper.unmount();
  });

  it("menampilkan dialog error saat gagal memuat", async () => {
    api.getUsers.mockRejectedValue(new Error("Gagal"));
    const { wrapper } = await renderWithProviders(UsersPage);
    await flushPromises();
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Gagal");
    wrapper.unmount();
  });
});
