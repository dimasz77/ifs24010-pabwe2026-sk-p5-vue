import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";

export function createMockPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

const Stub = { template: "<div>stub</div>" };

/**
 * Render komponen dengan Pinia dan Vue Router (memory history).
 * Semua rute yang tidak terdaftar ditangani oleh rute stub.
 */
export async function renderWithProviders(component, options = {}) {
  const { route = "/", routes = [], props = {}, slots = {}, global = {} } = options;
  const pinia = createMockPinia();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [...routes, { path: "/:pathMatch(.*)*", component: Stub }],
  });
  router.push(route);
  await router.isReady();

  const wrapper = mount(component, {
    props,
    slots,
    attachTo: document.body,
    global: { ...global, plugins: [pinia, router, ...(global.plugins ?? [])] },
  });
  await flushPromises();
  return { wrapper, router, pinia };
}
