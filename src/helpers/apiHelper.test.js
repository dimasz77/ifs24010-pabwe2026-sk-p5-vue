import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  apiFetch,
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  unwrap,
} from "./apiHelper";

const mockFetch = (response) => vi.fn().mockResolvedValue(response);
const okResponse = (json) => ({ ok: true, json: () => Promise.resolve(json) });

describe("apiHelper", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("mengirim GET tanpa header otorisasi dan mengabaikan parameter kosong", async () => {
    const fetchMock = mockFetch(okResponse({ success: true }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await apiFetch("/aucations", { params: { is_me: 1, is_closed: "", q: null, zero: 0 } });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url.pathname.endsWith("/aucations")).toBe(true);
    expect(url.searchParams.get("is_me")).toBe("1");
    expect(url.searchParams.get("zero")).toBe("0");
    expect(url.searchParams.has("is_closed")).toBe(false);
    expect(url.searchParams.has("q")).toBe(false);
    expect(init).toEqual({ method: "GET", headers: {}, body: undefined });
    expect(result).toEqual({ success: true });
  });

  it("mengirim body JSON beserta token Bearer", async () => {
    putAccessToken("token-1");
    const fetchMock = mockFetch(okResponse({ success: true }));
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/auth/login", { method: "POST", body: { a: 1 } });

    const init = fetchMock.mock.calls[0][1];
    expect(init.headers).toEqual({ Authorization: "Bearer token-1", "Content-Type": "application/json" });
    expect(init.body).toBe('{"a":1}');
  });

  it("mengirim FormData apa adanya", async () => {
    const form = new FormData();
    const fetchMock = mockFetch(okResponse({}));
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/upload", { method: "POST", form });

    expect(fetchMock.mock.calls[0][1].body).toBe(form);
  });

  it("melempar pesan dari server saat response tidak ok", async () => {
    vi.stubGlobal("fetch", mockFetch({ ok: false, json: () => Promise.resolve({ message: "Ditolak" }) }));
    await expect(apiFetch("/x")).rejects.toThrow("Ditolak");
  });

  it("melempar pesan bawaan saat success false tanpa pesan", async () => {
    vi.stubGlobal("fetch", mockFetch(okResponse({ success: false })));
    await expect(apiFetch("/x")).rejects.toThrow("Terjadi kesalahan pada server");
  });

  it("menangani response bukan JSON", async () => {
    vi.stubGlobal("fetch", mockFetch({ ok: false, json: () => Promise.reject(new Error("bad")) }));
    await expect(apiFetch("/x")).rejects.toThrow("Terjadi kesalahan pada server");
  });

  it("unwrap mengambil key jika ada, atau data itu sendiri", () => {
    expect(unwrap({ data: { users: [1] } }, "users")).toEqual([1]);
    expect(unwrap({ data: [2] }, "users")).toEqual([2]);
    expect(unwrap({}, "users")).toBeUndefined();
  });
});
