export function generateInvoiceInformation(doc, invoice) {
  /* Header */

  doc.image('./images/logo.png', 200, 45, { width: 200 });

  doc.fontSize(20).text('Invoice', 50, 160).text('Customer', 295, 160);

  generateHr(doc, 185);

  const customerInfoHeight = 200;

  doc
    .fontSize(10)
    .text('Order ID:', 50, customerInfoHeight)
    .font('Helvetica')
    .text(invoice.invoice_nr, 100, customerInfoHeight)
    .text('Order Date:', 50, customerInfoHeight + 15)
    .text(formatDate(new Date()), 120, customerInfoHeight + 15)
    .text('Total:', 50, customerInfoHeight + 30)
    .text(formatCurrency(invoice.subtotal + invoice.delivery), 120, customerInfoHeight + 30)

    .font('Helvetica')
    .text('Email:', 300, customerInfoHeight)
    .text(invoice.shipping.email, 400, customerInfoHeight)
    .text('Shipping Address:', 300, customerInfoHeight + 15)
    .text(invoice.shipping.address, 400, customerInfoHeight + 15)
    .text('Country:', 300, customerInfoHeight + 30)
    .text(invoice.shipping.city + ', ' + invoice.shipping.country, 400, customerInfoHeight + 30);

  generateHr(doc, 252);
}

export function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableHeight = 330;

  doc.font('Helvetica-Bold');
  generateTable(
    doc,
    invoiceTableHeight,
    'Quantity',
    'Description',
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
      item.description,
      item.productId,
      formatCurrency(item.amount * item.quantity),
      item.item,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  /* Subtotal, Delivery and Total */

  const subtotalPosition = invoiceTableHeight + (i + 1) * 35;
  generateTable(
    doc,
    subtotalPosition,
    '',
    '',
    '',
    '',
    'Subtotal',
    formatCurrency(invoice.subtotal)
  );

  const deliveryPosition = subtotalPosition + 20;
  generateTable(
    doc,
    deliveryPosition,
    '',
    '',
    '',
    '',
    'Delivery',
    formatCurrency(invoice.delivery)
  );

  const totalPosition = deliveryPosition + 25;
  doc.font('Helvetica-Bold');
  generateTable(
    doc,
    totalPosition,
    '',
    '',
    '',
    '',
    'Total',
    formatCurrency(invoice.subtotal + invoice.delivery)
  );
  doc.font('Helvetica');

  /* Footer */

  doc.fontSize(15).text('Thank you for your business', 50, 580, { align: 'center', width: 500 });
}

function generateTable(doc, y, item, description, productId, price, quantity, amount) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 125, y)
    .text(productId, 265, y)
    .text(price, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(amount, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#cca154').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return '$' + cents.toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}
