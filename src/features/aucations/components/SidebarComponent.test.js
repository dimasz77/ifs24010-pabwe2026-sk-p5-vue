import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import SidebarComponent from "./SidebarComponent.vue";

describe("SidebarComponent", () => {
  it("menampilkan seluruh menu dan tersembunyi secara bawaan di layar kecil", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent);
    const links = wrapper.findAll("a");
    expect(links.map((link) => link.text())).toEqual([
      "Dashboard Lelang",
      "Lelang Saya",
      "Daftar Pengguna",
      "Profil Saya",
    ]);
    expect(wrapper.find("aside").classes()).toContain("hidden");
    expect(wrapper.find("nav").attributes("aria-label")).toBe("Menu lelang");
    wrapper.unmount();
  });

  it("terlihat saat drawer dibuka", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent, { props: { open: true } });
    expect(wrapper.find("aside").classes()).toContain("block");
    wrapper.unmount();
  });
});
