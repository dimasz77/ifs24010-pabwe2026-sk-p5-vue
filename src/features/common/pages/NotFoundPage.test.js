import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import NotFoundPage from "./NotFoundPage.vue";

describe("NotFoundPage", () => {
  it("menampilkan pesan 404 dan tautan kembali", async () => {
    const { wrapper } = await renderWithProviders(NotFoundPage);
    expect(wrapper.find("h1").text()).toContain("404");
    expect(wrapper.find("a").attributes("href")).toBe("/");
    wrapper.unmount();
  });
});
