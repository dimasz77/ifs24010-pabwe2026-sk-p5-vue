import { describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

import App from "./App.vue";
import { routes } from "./router";
import { putAccessToken } from "./helpers/apiHelper";

async function renderApp(path) {
  const router = createRouter({ history: createMemoryHistory(), routes });
  router.push(path);
  await router.isReady();
  const wrapper = mount(App, { global: { plugins: [createPinia(), router] }, attachTo: document.body });
  await flushPromises();
  return { wrapper, router };
}

describe("App", () => {
  it("menampilkan halaman login", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const { wrapper } = await renderApp("/auth/login");
    expect(wrapper.find("h1").text()).toBe("Masuk Akun");
    wrapper.unmount();
  });

  it("menampilkan halaman 404 untuk rute tidak dikenal", async () => {
    const { wrapper } = await renderApp("/tidak-ada");
    expect(wrapper.find("h1").text()).toContain("404");
    wrapper.unmount();
  });

  it("menampilkan dashboard lelang untuk pengguna yang masuk", async () => {
    putAccessToken("token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: { aucations: [] } }) }),
    );
    const { wrapper } = await renderApp("/");
    expect(wrapper.find("h1").text()).toBe("Daftar Lelang");
    expect(wrapper.text()).toContain("Belum ada lelang");
    wrapper.unmount();
    localStorage.clear();
  });
});
