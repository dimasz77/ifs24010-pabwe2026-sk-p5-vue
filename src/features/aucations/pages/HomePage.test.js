import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const api = vi.hoisted(() => ({ getAucations: vi.fn(), postAucation: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", async (original) => ({ ...(await original()), ...dialogs }));
vi.mock("../api/aucationApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import HomePage from "./HomePage.vue";

const future = new Date(Date.now() + 86_400_000).toISOString();
const past = new Date(Date.now() - 86_400_000).toISOString();
const items = [
  { id: 1, title: "Jam Antik", description: "Jam saku", start_bid: 1000, closed_at: future, cover: "/c.png" },
  { id: 2, title: "Sepeda", description: "Sepeda gunung", start_bid: 5000, highest_bid: 7000, closed_at: past },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.getAucations.mockResolvedValue({ data: { aucations: items } });
  });

  it("menampilkan kartu lelang beserta status dan cover", async () => {
    const { wrapper } = await renderWithProviders(HomePage);
    expect(api.getAucations).toHaveBeenCalledWith({});
    expect(wrapper.find("h1").text()).toBe("Daftar Lelang");

    const cards = wrapper.findAll("ul > li");
    expect(cards).toHaveLength(2);
    expect(cards[0].find("img").attributes("alt")).toBe("Cover Jam Antik");
    expect(cards[0].text()).toContain("Berlangsung");
    expect(cards[1].text()).toContain("Tanpa cover");
    expect(cards[1].text()).toContain("Ditutup");
    wrapper.unmount();
  });

  it("menyaring lelang lewat pencarian langsung", async () => {
    const { wrapper } = await renderWithProviders(HomePage);
    await wrapper.find("#aucation-search").setValue("sepeda");
    expect(wrapper.findAll("ul > li")).toHaveLength(1);

    await wrapper.find("#aucation-search").setValue("tidak ada");
    expect(wrapper.text()).toContain("Belum ada lelang");
    wrapper.unmount();
  });

  it("memakai tab dari query dan mengganti tab", async () => {
    const { wrapper, router } = await renderWithProviders(HomePage, { route: "/?tab=me" });
    expect(api.getAucations).toHaveBeenLastCalledWith({ is_me: 1 });

    const buttons = wrapper.findAll('[role="group"] button');
    expect(buttons[1].attributes("aria-pressed")).toBe("true");

    await buttons[3].trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query.tab).toBe("closed");
    expect(api.getAucations).toHaveBeenLastCalledWith({ is_closed: 1 });
    wrapper.unmount();
  });

  it("mengabaikan tab yang tidak dikenal", async () => {
    const { wrapper } = await renderWithProviders(HomePage, { route: "/?tab=aneh" });
    expect(api.getAucations).toHaveBeenLastCalledWith({});
    wrapper.unmount();
  });

  it("menampilkan status memuat", async () => {
    api.getAucations.mockReturnValue(new Promise(() => {}));
    const { wrapper } = await renderWithProviders(HomePage);
    expect(wrapper.find('[role="status"]').text()).toContain("Memuat");
    wrapper.unmount();
  });

  it("menampilkan dialog error saat gagal memuat", async () => {
    api.getAucations.mockRejectedValue(new Error("Server mati"));
    const { wrapper } = await renderWithProviders(HomePage);
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Server mati");
    wrapper.unmount();
  });

  it("membuka modal tambah dan memuat ulang setelah lelang ditambahkan", async () => {
    api.postAucation.mockResolvedValue({ message: "Dibuat" });
    const { wrapper } = await renderWithProviders(HomePage);
    await wrapper.find("div > button").trigger("click");
    expect(wrapper.find("dialog").element.hasAttribute("open")).toBe(true);

    await wrapper.find("#add-title").setValue("Baru");
    await wrapper.find("#add-desc").setValue("Desk");
    await wrapper.find("#add-bid").setValue("100");
    await wrapper.find("#add-closed").setValue("2030-01-01T10:00");
    await wrapper.find("dialog form").trigger("submit");
    await flushPromises();

    expect(api.getAucations).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });
});
