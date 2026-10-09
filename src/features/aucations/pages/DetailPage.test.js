import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));
const api = vi.hoisted(() => ({
  getAucation: vi.fn(),
  deleteAucation: vi.fn(),
  deleteBid: vi.fn(),
  postBid: vi.fn(),
  putAucation: vi.fn(),
  postCover: vi.fn(),
}));
const userApi = vi.hoisted(() => ({ getMe: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", async (original) => ({ ...(await original()), ...dialogs }));
vi.mock("../api/aucationApi", () => api);
vi.mock("../../users/api/userApi", () => userApi);

import { renderWithProviders } from "../../../test-utils";
import DetailPage from "./DetailPage.vue";

const future = new Date(Date.now() + 86_400_000).toISOString();
const base = {
  id: 9,
  title: "Jam Antik",
  description: "# Spesifikasi\n- Kuno",
  start_bid: 1000,
  closed_at: future,
  user_id: 1,
  cover: "/c.png",
  bids: [{ id: 1, bid: 1500, user: { name: "Budi" } }],
};

const render = (aucation = base, profileId = 1) => {
  api.getAucation.mockResolvedValue({ data: { aucation } });
  userApi.getMe.mockResolvedValue({ data: { user: { id: profileId } } });
  return renderWithProviders(DetailPage, {
    route: "/aucations/9",
    routes: [{ path: "/aucations/:aucationId", component: DetailPage }],
  });
};

describe("DetailPage", () => {
  beforeEach(() => vi.resetAllMocks());

  it("menampilkan detail lelang, markdown, dan riwayat tawaran", async () => {
    const { wrapper } = await render();
    expect(api.getAucation).toHaveBeenCalledWith("9");
    expect(wrapper.find("h1").text()).toBe("Jam Antik");
    expect(wrapper.findAll("h2")[0].text()).toBe("Spesifikasi");
    expect(wrapper.text()).toContain("Budi");
    expect(wrapper.text()).toContain("Berlangsung");
    expect(wrapper.find("img").attributes("alt")).toBe("Cover Jam Antik");
    wrapper.unmount();
  });

  it("menampilkan lelang tanpa cover, tanpa tawaran, dan sudah ditutup", async () => {
    const { wrapper } = await render({ ...base, cover: undefined, bids: undefined, is_closed: true });
    expect(wrapper.find("article img").exists()).toBe(false);
    expect(wrapper.text()).toContain("Belum ada penawaran");
    expect(wrapper.text()).toContain("Ditutup");
    wrapper.unmount();
  });

  it("pemilik dapat mengubah lelang dan mengganti cover lewat modal", async () => {
    const { wrapper } = await render();
    expect(wrapper.find("article > div").text()).not.toContain("Ajukan tawaran");
    const buttons = wrapper.findAll("article > div button");
    await buttons[0].trigger("click");
    expect(wrapper.find("#change-title").exists()).toBe(true);
    await buttons[1].trigger("click");
    expect(wrapper.find("#cover-input").exists()).toBe(true);
    wrapper.unmount();
  });

  it("pemilik dapat menghapus lelang setelah konfirmasi", async () => {
    dialogs.showConfirmDialog.mockResolvedValue(true);
    api.deleteAucation.mockResolvedValue({ message: "Terhapus" });
    const { wrapper, router } = await render();
    await wrapper.findAll("article > div button")[2].trigger("click");
    await flushPromises();

    expect(api.deleteAucation).toHaveBeenCalledWith("9");
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Terhapus");
    expect(router.currentRoute.value.path).toBe("/");
    wrapper.unmount();
  });

  it("tidak menghapus jika konfirmasi dibatalkan", async () => {
    dialogs.showConfirmDialog.mockResolvedValue(false);
    const { wrapper } = await render();
    await wrapper.findAll("article > div button")[2].trigger("click");
    await flushPromises();
    expect(api.deleteAucation).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("menampilkan dialog error saat penghapusan gagal", async () => {
    dialogs.showConfirmDialog.mockResolvedValue(true);
    api.deleteAucation.mockRejectedValue(new Error("Tidak boleh"));
    const { wrapper } = await render();
    await wrapper.findAll("article > div button")[2].trigger("click");
    await flushPromises();
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Tidak boleh");
    wrapper.unmount();
  });

  it("peserta dapat mengajukan tawaran lewat modal", async () => {
    const { wrapper } = await render(base, 2);
    expect(wrapper.find("article > div").text()).not.toContain("Hapus lelang");
    await wrapper.findAll("article > div button")[0].trigger("click");
    expect(wrapper.find("#bid-input").exists()).toBe(true);

    api.postBid.mockResolvedValue({ message: "Tawaran dikirim" });
    await wrapper.find("#bid-input").setValue("2000");
    await wrapper.findAll("form").at(-1).trigger("submit");
    await flushPromises();
    expect(api.postBid).toHaveBeenCalledWith(9, { bid: 2000 });
    expect(api.getAucation).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it("peserta dapat membatalkan tawaran", async () => {
    api.deleteBid.mockResolvedValue({ message: "Tawaran dibatalkan" });
    const { wrapper } = await render(base, 2);
    await wrapper.findAll("article > div button")[1].trigger("click");
    await flushPromises();

    expect(api.deleteBid).toHaveBeenCalledWith("9");
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Tawaran dibatalkan");
    expect(api.getAucation).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it("menampilkan dialog error saat pembatalan tawaran gagal", async () => {
    api.deleteBid.mockRejectedValue(new Error("Belum menawar"));
    const { wrapper } = await render(base, 2);
    await wrapper.findAll("article > div button")[1].trigger("click");
    await flushPromises();
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Belum menawar");
    wrapper.unmount();
  });

  it("menampilkan status memuat", async () => {
    api.getAucation.mockReturnValue(new Promise(() => {}));
    userApi.getMe.mockResolvedValue({ data: { user: { id: 1 } } });
    const { wrapper } = await renderWithProviders(DetailPage, {
      route: "/aucations/9",
      routes: [{ path: "/aucations/:aucationId", component: DetailPage }],
    });
    expect(wrapper.find('[role="status"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("menampilkan pesan saat lelang tidak ditemukan", async () => {
    api.getAucation.mockRejectedValue(new Error("Lelang tidak ada"));
    userApi.getMe.mockResolvedValue({ data: { user: { id: 1 } } });
    const { wrapper } = await renderWithProviders(DetailPage, {
      route: "/aucations/9",
      routes: [{ path: "/aucations/:aucationId", component: DetailPage }],
    });
    expect(wrapper.find("h1").text()).toBe("Lelang tidak ditemukan");
    expect(wrapper.find('[role="alert"]').text()).toBe("Lelang tidak ada");
    wrapper.unmount();
  });
});
