"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceTable = exports.generateInvoiceInformation = void 0;
function generateInvoiceInformation(doc, invoice) {
    doc.image('./images/logo.png', 200, 45, { width: 200 });
    doc.fontSize(14).text('Invoice', 100, 160).text('Customer', 350, 160);
    generateHr(doc, 185);
    const customerInfoHeight = 200;
    doc
        .fontSize(9)
        .text('Order ID:', 100, customerInfoHeight)
        .font('Helvetica')
        .text(invoice.invoice_nr, 140, customerInfoHeight)
        .text('Order Date:', 100, customerInfoHeight + 15)
        .text(formatDate(new Date()), 150, customerInfoHeight + 15)
        .text('Total:', 100, customerInfoHeight + 30)
        .text(formatCurrency(invoice.subtotal + invoice.delivery), 125, customerInfoHeight + 30)
        .font('Helvetica')
        .text('Email:', 350, customerInfoHeight)
        .text(invoice.shipping.email, 380, customerInfoHeight)
        .text('Shipping Address:', 350, customerInfoHeight + 15)
        .text(invoice.shipping.address, 430, customerInfoHeight + 15)
        .text('Country:', 350, customerInfoHeight + 30)
        .text(invoice.shipping.city + ', ' + invoice.shipping.country, 390, customerInfoHeight + 30);
    generateHr(doc, 252);
}
exports.generateInvoiceInformation = generateInvoiceInformation;
function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableHeight = 330;
    doc.font('Helvetica-Bold');
    generateTable(doc, invoiceTableHeight, 'Quantity', 'Product ID', 'Price', 'Item', 'Amount');
    generateHr(doc, invoiceTableHeight + 20);
    doc.font('Helvetica');
    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableHeight + (i + 1) * 30;
        generateTable(doc, position, item.quantity, item.productId, formatCurrency(item.amount * item.quantity), item.item, formatCurrency(item.amount));
        generateHr(doc, position + 20);
    }
    const subtotalPosition = invoiceTableHeight + (i + 1) * 35;
    generateTable(doc, subtotalPosition, 'Subtotal', '', '', '', formatCurrency(invoice.subtotal));
    const deliveryPosition = subtotalPosition + 20;
    generateTable(doc, deliveryPosition, 'Delivery', '', '', '', formatCurrency(invoice.delivery));
    const totalPosition = deliveryPosition + 25;
    doc.font('Helvetica-Bold');
    generateTable(doc, totalPosition, 'Total', '', '', '', formatCurrency(invoice.subtotal + invoice.delivery));
    doc.font('Helvetica');
    doc.fontSize(14).text(`Thank you for your purchase`, 50, 280, { align: 'center', width: 500 });
}
exports.generateInvoiceTable = generateInvoiceTable;
function generateTable(doc, y, item, productId, price, quantity, amount) {
    doc
        .fontSize(9)
        .text(quantity, 80, y, { width: 90, align: 'center' })
        .text(productId, 160, y, { width: 90, align: 'center' })
        .text(price, 240, y, { width: 90, align: 'center' })
        .text(item, 320, y, { width: 90, align: 'center' })
        .text(amount, 400, y, { width: 90, align: 'center' });
}
function generateHr(doc, y) {
    doc.strokeColor('#a76f4d').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
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
//# sourceMappingURL=invoice.js.map