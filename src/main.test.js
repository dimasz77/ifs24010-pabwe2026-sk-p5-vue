import { describe, it, expect, vi } from "vitest";

vi.mock("./router", () => ({
  default: {
    install: vi.fn(),
    isReady: () => Promise.resolve(),
  },
}));

vi.mock("./App.vue", async () => {
  const { h } = await import("vue");
  return {
    default: { render: () => h("p", { id: "app-content" }, "app") },
  };
});

describe("main.js", () => {
  it("memasang aplikasi ke #app setelah router siap", async () => {
    document.body.innerHTML = '<div id="app"></div>';

    await import("./main.js");

    await vi.waitFor(() => {
      expect(document.querySelector("#app-content")).not.toBeNull();
    });
  });
});