import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import NavbarComponent from "./NavbarComponent.vue";

describe("NavbarComponent", () => {
  it("mengirim event toggle-menu dan logout", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent);
    const [menuButton, logoutButton] = wrapper.findAll("button");

    expect(menuButton.attributes("aria-expanded")).toBe("false");
    await menuButton.trigger("click");
    await logoutButton.trigger("click");

    expect(wrapper.emitted("toggle-menu")).toHaveLength(1);
    expect(wrapper.emitted("logout")).toHaveLength(1);
    wrapper.unmount();
  });

  it("menandai menu terbuka melalui aria-expanded", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent, { props: { menuOpen: true } });
    expect(wrapper.find("button").attributes("aria-expanded")).toBe("true");
    wrapper.unmount();
  });
});
