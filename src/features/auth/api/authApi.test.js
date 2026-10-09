import { describe, expect, it, vi } from "vitest";

const apiFetch = vi.hoisted(() => vi.fn());
vi.mock("../../../helpers/apiHelper", () => ({ apiFetch }));

import { postLogin, postRegister } from "./authApi";

describe("authApi", () => {
  it("memanggil endpoint login dan register", () => {
    postLogin({ a: 1 });
    postRegister({ b: 2 });
    expect(apiFetch).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { a: 1 } });
    expect(apiFetch).toHaveBeenCalledWith("/auth/register", { method: "POST", body: { b: 2 } });
  });
});
