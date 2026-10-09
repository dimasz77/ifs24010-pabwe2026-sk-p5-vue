import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const api = vi.hoisted(() => ({
  getUsers: vi.fn(),
  getMe: vi.fn(),
  putMe: vi.fn(),
  postPhoto: vi.fn(),
  putPassword: vi.fn(),
}));
vi.mock("../../../helpers/toolsHelper", () => dialogs);
vi.mock("../api/userApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import ProfilePage from "./ProfilePage.vue";

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.getMe.mockResolvedValue({ data: { user: { id: 1, name: "Ifs", email: "i@d.id" } } });
  });

  it("menampilkan profil dan mengubah nama", async () => {
    api.putMe.mockResolvedValue({ message: "Profil diubah" });
    const { wrapper } = await renderWithProviders(ProfilePage);

    expect(wrapper.text()).toContain("i@d.id");
    expect(wrapper.find("#profile-name-input").element.value).toBe("Ifs");

    await wrapper.find("#profile-name-input").setValue("Baru");
    await wrapper.findAll("form")[0].trigger("submit");
    await flushPromises();

    expect(api.putMe).toHaveBeenCalledWith({ name: "Baru" });
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Profil diubah");
    wrapper.unmount();
  });

  it("mengunggah foto profil", async () => {
    api.postPhoto.mockResolvedValue({ message: "Foto diubah" });
    const { wrapper } = await renderWithProviders(ProfilePage);
    const file = new File(["x"], "foto.png", { type: "image/png" });
    Object.defineProperty(wrapper.find("#profile-photo-input").element, "files", { value: [file] });

    await wrapper.findAll("form")[1].trigger("submit");
    await flushPromises();

    expect(api.postPhoto.mock.calls[0][0].get("photo")).toBe(file);
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Foto diubah");
    wrapper.unmount();
  });

  it("mengubah kata sandi", async () => {
    api.putPassword.mockResolvedValue({ message: "Sandi diubah" });
    const { wrapper } = await renderWithProviders(ProfilePage);

    await wrapper.find("#profile-old-password").setValue("lama123");
    await wrapper.find("#profile-new-password").setValue("baru123");
    await wrapper.findAll("form")[2].trigger("submit");
    await flushPromises();

    expect(api.putPassword).toHaveBeenCalledWith({ password: "lama123", new_password: "baru123" });
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Sandi diubah");
    wrapper.unmount();
  });

  it("menampilkan dialog error saat aksi gagal", async () => {
    api.putMe.mockRejectedValue(new Error("Ditolak"));
    const { wrapper } = await renderWithProviders(ProfilePage);
    await wrapper.findAll("form")[0].trigger("submit");
    await flushPromises();
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Ditolak");
    wrapper.unmount();
  });

  it("menampilkan status memuat dan error saat profil gagal dimuat", async () => {
    api.getMe.mockRejectedValue(new Error("Tidak masuk"));
    const { wrapper } = await renderWithProviders(ProfilePage);
    expect(wrapper.text()).toContain("Memuat profil");
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Tidak masuk");
    wrapper.unmount();
  });
});
