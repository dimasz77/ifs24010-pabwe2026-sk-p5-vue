import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ModalDialog from "./ModalDialog.vue";

describe("ModalDialog", () => {
  it("membuka dan menutup dialog serta menampilkan judul dan slot", async () => {
    const wrapper = mount(ModalDialog, {
      props: { title: "Judul", titleId: "judul-id" },
      slots: { default: "<p>isi</p>" },
    });
    const dialog = wrapper.find("dialog");

    expect(dialog.attributes("aria-labelledby")).toBe("judul-id");
    expect(wrapper.find("#judul-id").text()).toBe("Judul");
    expect(wrapper.text()).toContain("isi");

    wrapper.vm.open();
    expect(dialog.element.hasAttribute("open")).toBe(true);
    wrapper.vm.close();
    expect(dialog.element.hasAttribute("open")).toBe(false);
  });
});
