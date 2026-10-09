import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const api = vi.hoisted(() => ({ postCover: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => dialogs);
vi.mock("../api/aucationApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import ChangeCoverModal from "./ChangeCoverModal.vue";

const file = new File(["x"], "cover.png", { type: "image/png" });

async function chooseFile(wrapper) {
  const input = wrapper.find("#cover-input");
  Object.defineProperty(input.element, "files", { value: [file], configurable: true });
  await input.trigger("change");
}

describe("ChangeCoverModal", () => {
  beforeEach(() => vi.resetAllMocks());

  it("menampilkan pratinjau dan mengunggah cover", async () => {
    api.postCover.mockResolvedValue({ message: "Cover diubah" });
    const { wrapper } = await renderWithProviders(ChangeCoverModal, { props: { aucationId: 3 } });
    expect(wrapper.find('img[alt="Pratinjau cover baru"]').exists()).toBe(false);

    wrapper.vm.open();
    await chooseFile(wrapper);
    expect(wrapper.find('img[alt="Pratinjau cover baru"]').attributes("src")).toBe("blob:preview");

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(api.postCover.mock.calls[0][0]).toBe(3);
    expect(api.postCover.mock.calls[0][1].get("cover")).toBe(file);
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Cover diubah");
    expect(wrapper.emitted("changed")).toHaveLength(1);
    wrapper.unmount();
  });

  it("menampilkan dialog error saat unggah gagal dan bisa dibatalkan", async () => {
    api.postCover.mockRejectedValue(new Error("Terlalu besar"));
    const { wrapper } = await renderWithProviders(ChangeCoverModal, { props: { aucationId: 3 } });
    await chooseFile(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Terlalu besar");

    await wrapper.find('button[type="button"]').trigger("click");
    expect(wrapper.find("dialog").element.hasAttribute("open")).toBe(false);
    wrapper.unmount();
  });
});
