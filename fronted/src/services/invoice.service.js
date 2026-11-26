import axiosInstance from "./Axios";

export const downloadInvoice = async (orderId) => {
  const response = await axiosInstance.get(
    `/api/invoices/${orderId}`,
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data], {
      type: "application/pdf",
    })
  );

  const link = document.createElement("a");

  link.href = url;
  link.download = `invoice-${orderId}.pdf`;

  link.click();

  window.URL.revokeObjectURL(url);
};