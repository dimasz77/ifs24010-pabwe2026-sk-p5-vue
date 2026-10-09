import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MarkdownEditor from "./MarkdownEditor.vue";

describe("MarkdownEditor", () => {
  it("menampilkan label, nilai, dan mengirim update:modelValue", async () => {
    const wrapper = mount(MarkdownEditor, { props: { id: "desc", modelValue: "halo" } });
    expect(wrapper.find("label").attributes("for")).toBe("desc");
    expect(wrapper.find("label").text()).toContain("Markdown");
    expect(wrapper.find("textarea").element.value).toBe("halo");

    await wrapper.find("textarea").setValue("baru");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["baru"]);
  });

  it("memakai nilai bawaan dan label kustom", () => {
    const wrapper = mount(MarkdownEditor, { props: { id: "d", label: "Catatan" } });
    expect(wrapper.find("label").text()).toBe("Catatan");
    expect(wrapper.find("textarea").element.value).toBe("");
  });
});
