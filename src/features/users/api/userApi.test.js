import { describe, expect, it, vi } from "vitest";

const apiFetch = vi.hoisted(() => vi.fn());
vi.mock("../../../helpers/apiHelper", () => ({ apiFetch }));

import { getMe, getUsers, postPhoto, putMe, putPassword } from "./userApi";

describe("userApi", () => {
  it("memanggil seluruh endpoint pengguna", () => {
    const form = new FormData();
    getUsers();
    getMe();
    putMe({ name: "a" });
    postPhoto(form);
    putPassword({ password: "x" });
    expect(apiFetch.mock.calls).toEqual([
      ["/users"],
      ["/users/me"],
      ["/users/me", { method: "PUT", body: { name: "a" } }],
      ["/users/me/photo", { method: "POST", form }],
      ["/users/me/password", { method: "PUT", body: { password: "x" } }],
    ]);
  });
});
