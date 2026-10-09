import { beforeEach, describe, expect, it, vi } from "vitest";

const fire = vi.hoisted(() => vi.fn());
vi.mock("sweetalert2", () => ({ default: { fire } }));

import {
  formatDate,
  formatRupiah,
  getHighestBid,
  isAucationClosed,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "./toolsHelper";

describe("toolsHelper", () => {
  beforeEach(() => fire.mockReset());

  it("menampilkan dialog sukses dan error", async () => {
    fire.mockResolvedValue({});
    await showSuccessDialog("ok");
    await showErrorDialog("gagal");
    expect(fire).toHaveBeenNthCalledWith(1, expect.objectContaining({ icon: "success", text: "ok" }));
    expect(fire).toHaveBeenNthCalledWith(2, expect.objectContaining({ icon: "error", text: "gagal" }));
  });

  it("mengembalikan hasil konfirmasi", async () => {
    fire.mockResolvedValueOnce({ isConfirmed: true }).mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("hapus?")).toBe(true);
    expect(await showConfirmDialog("hapus?")).toBe(false);
  });

  it("memformat rupiah", () => {
    expect(formatRupiah(15000).replace(/\s/g, " ")).toContain("15.000");
    expect(formatRupiah("abc")).toContain("0");
  });

  it("memformat tanggal", () => {
    expect(formatDate("")).toBe("-");
    expect(formatDate("2026-01-02T03:04:00Z")).toContain("2026");
  });

  it("menghitung tawaran tertinggi", () => {
    expect(getHighestBid({ highest_bid: 500, start_bid: 100 })).toBe(500);
    expect(getHighestBid({ start_bid: 100 })).toBe(100);
    expect(getHighestBid({})).toBe(0);
  });

  it("menentukan lelang ditutup", () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    const past = new Date(Date.now() - 86_400_000).toISOString();
    expect(isAucationClosed({ is_closed: 1, closed_at: future })).toBe(true);
    expect(isAucationClosed({ closed_at: past })).toBe(true);
    expect(isAucationClosed({ closed_at: future })).toBe(false);
  });
});
