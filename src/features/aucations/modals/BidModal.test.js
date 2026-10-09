import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

const dialogs = vi.hoisted(() => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const api = vi.hoisted(() => ({ postBid: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", async (original) => ({ ...(await original()), ...dialogs }));
vi.mock("../api/aucationApi", () => api);

import { renderWithProviders } from "../../../test-utils";
import BidModal from "./BidModal.vue";

const aucation = { id: 2, start_bid: 1000, highest_bid: 2000 };

async function submitBid(wrapper, value) {
  await wrapper.find("#bid-input").setValue(value);
  await wrapper.find("form").trigger("submit");
  await flushPromises();
}

describe("BidModal", () => {
  beforeEach(() => vi.resetAllMocks());

  it("menolak penawaran yang tidak lebih tinggi dan menampilkan alert", async () => {
    const { wrapper } = await renderWithProviders(BidModal, { props: { aucation } });
    wrapper.vm.open();
    await submitBid(wrapper, "2000");

    expect(api.postBid).not.toHaveBeenCalled();
    expect(wrapper.find('[role="alert"]').text()).toContain("lebih tinggi");
    expect(wrapper.find("#bid-input").attributes("aria-describedby")).toBe("bid-error");
    wrapper.unmount();
  });

  it("mengirim penawaran valid lalu menghapus pesan error", async () => {
    api.postBid.mockResolvedValue({ message: "Tawaran dikirim" });
    const { wrapper } = await renderWithProviders(BidModal, { props: { aucation } });
    await submitBid(wrapper, "1500");
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);

    await submitBid(wrapper, "2500");

    expect(api.postBid).toHaveBeenCalledWith(2, { bid: 2500 });
    expect(dialogs.showSuccessDialog).toHaveBeenCalledWith("Tawaran dikirim");
    expect(wrapper.emitted("bid")).toHaveLength(1);
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.find("#bid-input").element.value).toBe("");
    wrapper.unmount();
  });

  it("menampilkan dialog error saat server menolak dan bisa dibatalkan", async () => {
    api.postBid.mockRejectedValue(new Error("Lelang ditutup"));
    const { wrapper } = await renderWithProviders(BidModal, { props: { aucation } });
    await submitBid(wrapper, "3000");
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith("Lelang ditutup");

    await wrapper.find('button[type="button"]').trigger("click");
    expect(wrapper.find("dialog").element.hasAttribute("open")).toBe(false);
    wrapper.unmount();
  });
});
