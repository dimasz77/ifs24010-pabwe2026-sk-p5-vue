import "@testing-library/jest-dom/vitest";

// jsdom belum mengimplementasikan <dialog>.showModal()/close().
HTMLDialogElement.prototype.showModal = function showModal() {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function close() {
  this.removeAttribute("open");
};

URL.createObjectURL = () => "blob:preview";
URL.revokeObjectURL = () => {};
