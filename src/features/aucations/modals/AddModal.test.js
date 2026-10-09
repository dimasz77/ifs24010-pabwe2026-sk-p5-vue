import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const api = vi.hoisted(() => ({ postAucation: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => dialogs);
vi.mock("../api/aucationApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import AddModal from "./AddModal.vue";

async function fillAndSubmit(wrapper) {
  await wrapper.find("#add-title").setValue("Jam");
  await wrapper.find("#add-desc").setValue("Antik");
  await wrapper.find("#add-bid").setValue("1000");
  await wrapper.find("#add-closed").setValue("2030-01-02T10:30");
  await wrapper.find("form").trigger("submit");
  await flushPromises();
}

describe("AddModal", () => {
  beforeEach(() => vi.resetAllMocks());

  it("menambah lelang, menutup dialog, dan memberi tahu induk", async () => {
    api.postAucation.mockResolvedValue({ message: "Lelang dibuat" });
    const { wrapper } = await renderWithProviders(AddModal);

    wrapper.vm.open();
    expect(wrapper.find("dialog").element.hasAttribute("open")).toBe(true);
    await fillAndSubmit(wrapper);

    expect(api.postAucation).toHaveBeenCalledWith(expect.objectContaining({ title: "Jam", start_bid: 1000 }));
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Lelang dibuat");
    expect(wrapper.emitted("added")).toHaveLength(1);
    expect(wrapper.find("dialog").element.hasAttribute("open")).toBe(false);
    wrapper.unmount();
  });

  it("menampilkan dialog error saat gagal", async () => {
    api.postAucation.mockRejectedValue(new Error("Gagal membuat"));
    const { wrapper } = await renderWithProviders(AddModal);
    await fillAndSubmit(wrapper);
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Gagal membuat");
    expect(wrapper.emitted("added")).toBeUndefined();
    wrapper.unmount();
  });

  it("menutup dialog saat tombol batal ditekan", async () => {
    const { wrapper } = await renderWithProviders(AddModal);
    wrapper.vm.open();
    await wrapper.find('button[type="button"]').trigger("click");
    expect(wrapper.find("dialog").element.hasAttribute("open")).toBe(false);
    wrapper.unmount();
  });
});
