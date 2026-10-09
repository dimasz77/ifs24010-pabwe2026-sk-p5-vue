import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import AucationForm from "./AucationForm.vue";

describe("AucationForm", () => {
  it("mengirim payload dari field kosong", async () => {
    const wrapper = mount(AucationForm, { props: { idPrefix: "f" } });

    await wrapper.find("#f-title").setValue("Jam");
    await wrapper.find("#f-desc").setValue("Jam antik");
    await wrapper.find("#f-bid").setValue("1000");
    await wrapper.find("#f-closed").setValue("2030-01-02T10:30");
    await wrapper.find("form").trigger("submit");

    const [payload] = wrapper.emitted("submit")[0];
    expect(payload).toEqual({
      title: "Jam",
      description: "Jam antik",
      start_bid: 1000,
      closed_at: new Date("2030-01-02T10:30").toISOString(),
    });
  });

  it("memakai nilai awal dan menonaktifkan tombol saat busy", async () => {
    const wrapper = mount(AucationForm, {
      props: {
        idPrefix: "f",
        busy: true,
        initial: { title: "Lama", description: "Desk", start_bid: 5, closed_at: "2030-05-06T07:08:09Z" },
      },
    });
    expect(wrapper.find("#f-title").element.value).toBe("Lama");
    expect(wrapper.find("#f-desc").element.value).toBe("Desk");
    expect(wrapper.find("#f-bid").element.value).toBe("5");
    expect(wrapper.find("#f-closed").element.value).toBe("2030-05-06T07:08");
    expect(wrapper.find('button[type="submit"]').attributes("disabled")).toBeDefined();
  });

  it("mengirim event cancel", async () => {
    const wrapper = mount(AucationForm, { props: { idPrefix: "f" } });
    await wrapper.find('button[type="button"]').trigger("click");
    expect(wrapper.emitted("cancel")).toHaveLength(1);
  });
});
