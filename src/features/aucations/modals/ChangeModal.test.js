import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const api = vi.hoisted(() => ({ putAucation: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => dialogs);
vi.mock("../api/aucationApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import ChangeModal from "./ChangeModal.vue";

const aucation = { id: 4, title: "Lama", description: "Desk", start_bid: 10, closed_at: "2030-05-06T07:08:09Z" };

describe("ChangeModal", () => {
  beforeEach(() => vi.resetAllMocks());

  it("mengubah lelang dengan nilai awal dari props", async () => {
    api.putAucation.mockResolvedValue({ message: "Diubah" });
    const { wrapper } = await renderWithProviders(ChangeModal, { props: { aucation } });
    expect(wrapper.find("#change-title").element.value).toBe("Lama");

    wrapper.vm.open();
    await wrapper.find("#change-title").setValue("Baru");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(api.putAucation).toHaveBeenCalledWith(4, expect.objectContaining({ title: "Baru" }));
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Diubah");
    expect(wrapper.emitted("changed")).toHaveLength(1);
    wrapper.unmount();
  });

  it("menampilkan dialog error saat gagal", async () => {
    api.putAucation.mockRejectedValue(new Error("Ditolak"));
    const { wrapper } = await renderWithProviders(ChangeModal, { props: { aucation } });
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Ditolak");
    wrapper.find('button[type="button"]').trigger("click");
    wrapper.unmount();
  });
});
