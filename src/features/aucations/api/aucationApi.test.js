import { describe, expect, it, vi } from "vitest";

const apiFetch = vi.hoisted(() => vi.fn());
vi.mock("../../../helpers/apiHelper", () => ({ apiFetch }));

import * as api from "./aucationApi";

describe("aucationApi", () => {
  it("memanggil seluruh endpoint lelang", () => {
    const form = new FormData();
    api.getAucations({ is_me: 1 });
    api.getAucation(7);
    api.postAucation({ title: "t" });
    api.putAucation(7, { title: "u" });
    api.postCover(7, form);
    api.deleteAucation(7);
    api.postBid(7, { bid: 9 });
    api.deleteBid(7);
    api.deleteAllAucations();
    expect(apiFetch.mock.calls).toEqual([
      ["/aucations", { params: { is_me: 1 } }],
      ["/aucations/7"],
      ["/aucations", { method: "POST", body: { title: "t" } }],
      ["/aucations/7", { method: "PUT", body: { title: "u" } }],
      ["/aucations/7/cover", { method: "POST", form }],
      ["/aucations/7", { method: "DELETE" }],
      ["/aucations/7/bids", { method: "POST", body: { bid: 9 } }],
      ["/aucations/7/bids", { method: "DELETE" }],
      ["/aucations", { method: "DELETE" }],
    ]);
  });
});
