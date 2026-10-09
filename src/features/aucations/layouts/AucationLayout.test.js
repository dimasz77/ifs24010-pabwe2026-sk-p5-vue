import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import AucationLayout from "./AucationLayout.vue";
import { putAccessToken, getAccessToken } from "../../../helpers/apiHelper";

describe("AucationLayout", () => {
  it("menampilkan navbar, sidebar, dan konten rute anak", async () => {
    const child = { template: "<p>isi halaman</p>" };
    const { wrapper } = await renderWithProviders(AucationLayout, {
      routes: [{ path: "/", component: AucationLayout, children: [{ path: "", component: child }] }],
    });
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("aside").exists()).toBe(true);
    expect(wrapper.find("main").text()).toContain("isi halaman");
    wrapper.unmount();
  });

  it("membuka drawer menu dan keluar dari akun", async () => {
    putAccessToken("t");
    const { wrapper, router } = await renderWithProviders(AucationLayout, { route: "/profile" });
    const [menuButton, logoutButton] = wrapper.findAll("header button");

    expect(wrapper.find("aside").classes()).toContain("hidden");
    await menuButton.trigger("click");
    expect(wrapper.find("aside").classes()).toContain("block");

    await logoutButton.trigger("click");
    await new Promise((resolve) => setTimeout(resolve));
    expect(getAccessToken()).toBeNull();
    expect(router.currentRoute.value.path).toBe("/auth/login");
    wrapper.unmount();
  });
});
