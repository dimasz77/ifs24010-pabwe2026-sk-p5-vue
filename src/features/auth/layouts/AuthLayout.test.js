import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import AuthLayout from "./AuthLayout.vue";

describe("AuthLayout", () => {
  it("menampilkan logo, landmark main, dan konten rute anak", async () => {
    const child = { template: "<p>konten anak</p>" };
    const { wrapper } = await renderWithProviders(AuthLayout, {
      route: "/auth/login",
      routes: [{ path: "/auth", component: AuthLayout, children: [{ path: "login", component: child }] }],
      global: {},
    });
    expect(wrapper.find("main").exists()).toBe(true);
    expect(wrapper.find("img").attributes("alt")).toBe("Logo Delcom Auction");
    expect(wrapper.text()).toContain("Delcom Auction");
    wrapper.unmount();
  });
});
