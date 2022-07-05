import { OrderItem } from './order-item.entity';

type ShippingInformation = {
  email: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
};

interface Invoice {
  shipping: ShippingInformation;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  invoice_nr: string;
}

function generateInvoiceInformation(doc: PDFKit.PDFDocument, invoice: Invoice) {
  /* Header */

  doc.image('./images/logo.png', 200, 45, { width: 200 });

  doc.fontSize(14).text('Invoice', 100, 160).text('Customer', 350, 160);

  generateHr(doc, 185);

  const customerInfoHeight = 200;

  /* Order Information Table
   *
   * First value is the title of the row e.g. Order ID and the value
   * under it invoice.invoice_nr is the value beside it */

  doc
    .fontSize(9)
    .text('Order ID:', 100, customerInfoHeight)
    .font('Helvetica')
    .text(invoice.invoice_nr, 140, customerInfoHeight)
    .text('Order Date:', 100, customerInfoHeight + 15)
    .text(formatDate(new Date()), 150, customerInfoHeight + 15)
    .text('Total:', 100, customerInfoHeight + 30)
    .text(
      formatCurrency(invoice.subtotal + invoice.delivery),
      125,
      customerInfoHeight + 30
    )

    .font('Helvetica')
    .text('Email:', 350, customerInfoHeight)
    .text(invoice.shipping.email, 380, customerInfoHeight)
    .text('Shipping Address:', 350, customerInfoHeight + 15)
    .text(invoice.shipping.address, 430, customerInfoHeight + 15)
    .text('Country:', 350, customerInfoHeight + 30)
    .text(
      invoice.shipping.city + ', ' + invoice.shipping.country,
      390,
      customerInfoHeight + 30
    );

  generateHr(doc, 252);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, invoice: any) {
  let i: number;
  const invoiceTableHeight = 330;

  doc.font('Helvetica-Bold');
  generateTable(
    doc,
    invoiceTableHeight,
    'Quantity',
    'Product ID',
    'Price',
    'Item',
    'Amount'
  );
  generateHr(doc, invoiceTableHeight + 20);
  doc.font('Helvetica');

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableHeight + (i + 1) * 30;
    generateTable(
      doc,
      position,
      item.quantity,
      item.productId,
      formatCurrency(item.amount * item.quantity),
      item.item,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  /* Subtotal, Delivery and Total
   *
   * totalPosition accounts for height,
   * Horizontal position is based on which
   * argument the string occupies, because
   * it aligns with the item property */

  const subtotalPosition = invoiceTableHeight + (i + 1) * 35;
  generateTable(
    doc,
    subtotalPosition,
    'Subtotal',
    '',
    '',
    '',
    formatCurrency(invoice.subtotal)
  );

  const deliveryPosition = subtotalPosition + 20;
  generateTable(
    doc,
    deliveryPosition,
    'Delivery',
    '',
    '',
    '',
    formatCurrency(invoice.delivery)
  );

  const totalPosition = deliveryPosition + 25;
  doc.font('Helvetica-Bold');
  generateTable(
    doc,
    totalPosition,
    'Total',
    '',
    '',
    '',
    formatCurrency(invoice.subtotal + invoice.delivery)
  );
  doc.font('Helvetica');

  /* Thank you message */

  doc.fontSize(14).text(`Thank you for your purchase`, 50, 280, {
    align: 'center',
    width: 500
  });
}

/* Product table */

function generateTable(
  doc: PDFKit.PDFDocument,
  y: number,
  item: string,
  productId: string,
  price: string,
  quantity: string,
  amount: string
) {
  doc
    .fontSize(9)
    .text(quantity, 80, y, { width: 90, align: 'center' })
    .text(productId, 160, y, { width: 90, align: 'center' })
    .text(price, 240, y, { width: 90, align: 'center' })
    .text(item, 320, y, { width: 90, align: 'center' })
    .text(amount, 400, y, { width: 90, align: 'center' });
}

/* Horizontal line */
function generateHr(doc: PDFKit.PDFDocument, y: number) {
  doc.strokeColor('#a76f4d').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents: number) {
  return '$' + Number(cents).toFixed(2);
}

function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}

export { generateInvoiceTable, generateInvoiceInformation };
