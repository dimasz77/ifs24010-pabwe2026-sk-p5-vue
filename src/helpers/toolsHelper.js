// SweetAlert2 dimuat secara lazy agar bundle awal tetap kecil.
const baseOptions = {
  color: "#0f172a",
  background: "#ffffff",
  confirmButtonColor: "#4338ca",
  cancelButtonColor: "#475569",
  showClass: { popup: "", backdrop: "", icon: "" },
  hideClass: { popup: "", backdrop: "", icon: "" },
};

async function fire(options) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire({ ...baseOptions, ...options });
}

export const showSuccessDialog = (text) => fire({ icon: "success", title: "Berhasil", text });
export const showErrorDialog = (text) => fire({ icon: "error", title: "Gagal", text });

export async function showConfirmDialog(text) {
  const result = await fire({
    icon: "warning",
    title: "Konfirmasi",
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

export const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value) =>
  value ? new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";

/** Tawaran tertinggi saat ini; jika belum ada tawaran memakai harga awal. */
export const getHighestBid = (aucation) => Number(aucation.highest_bid ?? aucation.start_bid) || 0;

/** Lelang dianggap ditutup jika ditandai server atau batas waktu sudah lewat. */
export const isAucationClosed = (aucation) =>
  Boolean(aucation.is_closed) || new Date(aucation.closed_at).getTime() <= Date.now();
