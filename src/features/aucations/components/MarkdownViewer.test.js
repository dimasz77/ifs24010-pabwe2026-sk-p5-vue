import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MarkdownViewer from "./MarkdownViewer.vue";

describe("MarkdownViewer", () => {
  it("merender heading, daftar, dan paragraf", () => {
    const wrapper = mount(MarkdownViewer, { props: { content: "# Judul\n\n- satu\n- dua\nteks biasa" } });
    expect(wrapper.find("h2").text()).toBe("Judul");
    expect(wrapper.findAll("li").map((li) => li.text())).toEqual(["satu", "dua"]);
    expect(wrapper.find("p").text()).toBe("teks biasa");
  });

  it("tidak merender HTML mentah", () => {
    const wrapper = mount(MarkdownViewer, { props: { content: "<b>tebal</b>" } });
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.find("p").text()).toBe("<b>tebal</b>");
  });

  it("kosong secara bawaan", () => {
    expect(mount(MarkdownViewer).findAll("p")).toHaveLength(0);
  });
});
