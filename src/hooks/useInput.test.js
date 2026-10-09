import { describe, expect, it } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("memakai nilai awal bawaan", () => {
    const [value] = useInput();
    expect(value.value).toBe("");
  });

  it("memperbarui nilai saat onChange dipanggil", () => {
    const [value, onChange] = useInput("awal");
    expect(value.value).toBe("awal");
    onChange({ target: { value: "baru" } });
    expect(value.value).toBe("baru");
  });
});
