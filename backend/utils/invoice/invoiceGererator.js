import PDFDocument from "pdfkit";
import Order from '../../model/orderschema.model.js'


export const generateInvoicePDF = (order, stream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(stream);

  // HEADER
  doc
    .fontSize(20)
    .text("INVOICE", { align: "center" })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Order ID: ${order._id}`)
    .text(`Customer: ${order.user.username}`)
    .text(`Email: ${order.user.email}`)
    .moveDown();

  // ITEMS
  doc.fontSize(14).text("Items:");
  doc.moveDown(0.5);

  order.items.forEach((item, i) => {
    doc
      .fontSize(12)
      .text(
        `${i + 1}. ${item.product.name} | Qty: ${item.quantity} | Price: ₹${item.price}`
      );
  });

  doc.moveDown();


  doc
    .fontSize(14)
    .text(`Subtotal: ₹${order.subtotal}`)
    .text(`Discount: ₹${order.discount}`)
    .text(`Total: ₹${order.totalAmount}`, { underline: true });

  doc.moveDown();

  doc.text("Thank you for your purchase!", {
    align: "center",
  });

  doc.end();
};



export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${order._id}.pdf"`
    );

    generateInvoicePDF(order, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};