import { beforeEach, describe, expect, it } from "vitest";
import router, { authGuard } from "./router";
import { putAccessToken } from "./helpers/apiHelper";

describe("router", () => {
  beforeEach(() => localStorage.clear());

  it("mengarahkan rute terproteksi ke login saat belum masuk", () => {
    expect(authGuard({ path: "/", meta: { requiresAuth: true } })).toBe("/auth/login");
  });

  it("mengarahkan halaman auth ke beranda saat sudah masuk", () => {
    putAccessToken("t");
    expect(authGuard({ path: "/auth/login", meta: {} })).toBe("/");
  });

  it("mengizinkan navigasi lain", () => {
    expect(authGuard({ path: "/auth/login", meta: {} })).toBe(true);
    putAccessToken("t");
    expect(authGuard({ path: "/users", meta: { requiresAuth: true } })).toBe(true);
  });

  it("mendaftarkan seluruh rute dan memuat komponen secara lazy", async () => {
    const records = router.getRoutes();
    const loaders = records.flatMap((record) => Object.values(record.components ?? {}));
    const loaded = await Promise.all(loaders.map((load) => (typeof load === "function" ? load() : load)));
    expect(loaded.length).toBeGreaterThanOrEqual(8);
    expect(router.resolve("/aucations/5").matched.length).toBe(2);
  });
});
