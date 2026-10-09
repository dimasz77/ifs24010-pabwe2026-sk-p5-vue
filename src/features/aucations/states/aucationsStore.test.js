import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  getAucations: vi.fn(),
  getAucation: vi.fn(),
  postAucation: vi.fn(),
  putAucation: vi.fn(),
  postCover: vi.fn(),
  deleteAucation: vi.fn(),
  postBid: vi.fn(),
  deleteBid: vi.fn(),
  deleteAllAucations: vi.fn(),
}));
vi.mock("../api/aucationApi", () => api);

import { createMockPinia } from "../../../test-utils";
import { useAucationsStore } from "./aucationsStore";

describe("aucationsStore", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    createMockPinia();
  });

  it("mengambil daftar lelang", async () => {
    api.getAucations.mockResolvedValue({ data: { aucations: [{ id: 1 }] } });
    const store = useAucationsStore();
    await store.fetchAucations({ is_me: 1 });
    expect(api.getAucations).toHaveBeenCalledWith({ is_me: 1 });
    expect(store.aucations).toEqual([{ id: 1 }]);
    expect(store.isAucation).toBe(false);
  });

  it("memakai parameter dan hasil bawaan", async () => {
    api.getAucations.mockResolvedValue({});
    const store = useAucationsStore();
    await store.fetchAucations();
    expect(api.getAucations).toHaveBeenCalledWith({});
    expect(store.aucations).toEqual([]);
  });

  it("mengambil detail lelang dan mengosongkan data lama", async () => {
    api.getAucation.mockResolvedValue({ data: { aucation: { id: 9 } } });
    const store = useAucationsStore();
    store.aucation = { id: 1 };
    const pending = store.fetchAucation(9);
    expect(store.aucation).toBeNull();
    await pending;
    expect(store.aucation).toEqual({ id: 9 });
  });

  it("mematikan status loading saat pengambilan gagal", async () => {
    api.getAucation.mockRejectedValue(new Error("tidak ada"));
    const store = useAucationsStore();
    await expect(store.fetchAucation(1)).rejects.toThrow("tidak ada");
    expect(store.isAucation).toBe(false);
  });

  it.each([
    ["addAucation", "postAucation", ["isAucationAdd", "isAucationAdded"], [{ t: 1 }]],
    ["changeAucation", "putAucation", ["isAucationChange", "isAucationChanged"], [3, { t: 1 }]],
    ["changeCover", "postCover", ["isAucationChangeCover", "isAucationChangedCover"], [3, new FormData()]],
    ["removeAucation", "deleteAucation", ["isAucationDelete", "isAucationDeleted"], [3]],
    ["addBid", "postBid", ["isBidAdd", "isBidAdded"], [3, { bid: 1 }]],
    ["removeBid", "deleteBid", ["isBidDelete", "isBidDeleted"], [3]],
    ["removeAllAucations", "deleteAllAucations", ["isAucationDeleteAll", "isAucationDeletedAll"], []],
  ])("%s memanggil API dan mengatur flag", async (action, apiName, [busy, done], args) => {
    api[apiName].mockResolvedValue({ message: "Selesai" });
    const store = useAucationsStore();

    expect(await store[action](...args)).toBe("Selesai");

    expect(api[apiName]).toHaveBeenCalledWith(...args);
    expect(store[busy]).toBe(false);
    expect(store[done]).toBe(true);
  });

  it("mutasi gagal tidak menandai selesai", async () => {
    api.postAucation.mockRejectedValue(new Error("gagal"));
    const store = useAucationsStore();
    await expect(store.addAucation({})).rejects.toThrow("gagal");
    expect(store.isAucationAdd).toBe(false);
    expect(store.isAucationAdded).toBe(false);
  });
});
