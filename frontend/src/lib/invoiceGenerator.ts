export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface InvoiceData {
  orderId: string | number;
  orderDate: string;
  paymentMethod: string;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  deliveryCharge?: number;
  gst?: number;
  grandTotal: number;
  address: {
    name: string;
    address?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
    mobile?: string;
  };
}

export const generateInvoicePDF = (data: InvoiceData): void => {
  const {
    orderId,
    orderDate,
    paymentMethod,
    items,
    subtotal,
    discount = 0,
    deliveryCharge = 0,
    gst = 0,
    grandTotal,
    address,
  } = data;

  const formattedDate = new Date(orderDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const itemRows = items
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? '#f9f9f9' : '#fff'}">
        <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;font-weight:600;color:#1a1a2e">${item.name}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;text-align:center;color:#555">${item.quantity}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;text-align:right;color:#555">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;text-align:right;font-weight:700;color:#1a1a2e">₹${item.total.toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice - ${orderId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #fff; padding: 0; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }

    .invoice-wrapper { max-width: 800px; margin: 0 auto; padding: 0; }

    /* Header */
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      padding: 40px 48px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand { }
    .brand-name { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
    .brand-name span { color: #f59e0b; }
    .brand-tagline { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 4px; letter-spacing: 1.5px; text-transform: uppercase; }
    .invoice-label { text-align: right; }
    .invoice-label h2 { font-size: 32px; font-weight: 900; color: rgba(255,255,255,0.15); letter-spacing: 2px; text-transform: uppercase; }
    .invoice-label p { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }
    .invoice-label strong { color: #f59e0b; }

    /* Meta strip */
    .meta-strip {
      background: #f59e0b;
      padding: 14px 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .meta-strip p { font-size: 12px; font-weight: 700; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-strip span { font-weight: 900; }

    /* Body */
    .body { padding: 40px 48px; }

    /* Bill to */
    .bill-section { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 36px; }
    .bill-box { flex: 1; }
    .bill-box h4 { font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 10px; }
    .bill-box p { font-size: 14px; color: #333; line-height: 1.7; }
    .bill-box p strong { font-size: 16px; color: #1a1a2e; font-weight: 700; }

    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
    thead tr { background: #1a1a2e; }
    thead th { color: white; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 14px 14px; text-align: left; }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }

    /* Totals */
    .totals-section { background: #f9f9f9; border-top: 2px solid #1a1a2e; padding: 24px 14px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #555; }
    .total-row span:last-child { font-weight: 600; color: #1a1a2e; }
    .total-row.discount span:last-child { color: #16a34a; }
    .grand-total { display: flex; justify-content: space-between; padding: 16px 0 6px; border-top: 2px dashed #ddd; margin-top: 12px; }
    .grand-total span:first-child { font-size: 16px; font-weight: 800; color: #1a1a2e; }
    .grand-total span:last-child { font-size: 22px; font-weight: 900; color: #f59e0b; }

    /* Footer */
    .footer-strip {
      background: #1a1a2e;
      color: white;
      text-align: center;
      padding: 24px 48px;
      margin-top: 40px;
    }
    .footer-strip p { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.8; }
    .footer-strip strong { color: #f59e0b; }

    /* Print button */
    .print-btn {
      display: block;
      margin: 24px auto;
      padding: 14px 40px;
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
    }
    .print-btn:hover { opacity: 0.9; }

    .stamp {
      display: inline-block;
      border: 3px solid #16a34a;
      color: #16a34a;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      transform: rotate(-2deg);
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">

    <!-- Print Button (hidden on print) -->
    <div class="no-print" style="text-align:center;padding:20px;background:#f3f4f6;">
      <button class="print-btn" onclick="window.print()">⬇️ Download / Print Invoice</button>
      <p style="font-size:12px;color:#999;margin-top:8px">Use "Save as PDF" in print dialog to download</p>
    </div>

    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-name">Sastaa<span>Bazaar</span></div>
        <div class="brand-tagline">Sab Se Sasta, Sab Se Acha</div>
        <div class="stamp" style="margin-top:16px">PAID ✓</div>
      </div>
      <div class="invoice-label">
        <h2>Invoice</h2>
        <p>Order <strong>#${orderId}</strong></p>
        <p style="margin-top:6px;color:rgba(255,255,255,0.5)">Date: ${formattedDate}</p>
      </div>
    </div>

    <!-- Meta Strip -->
    <div class="meta-strip">
      <p>Payment: <span>${paymentMethod}</span></p>
      <p>Status: <span>✅ Confirmed</span></p>
      <p>Delivery: <span>5–7 Business Days</span></p>
    </div>

    <!-- Body -->
    <div class="body">
      <!-- Bill To / Ship To -->
      <div class="bill-section">
        <div class="bill-box">
          <h4>Bill To / Ship To</h4>
          <p><strong>${address.name || 'Customer'}</strong></p>
          <p>${address.address || address.locality || ''}</p>
          <p>${address.city || ''}${address.state ? ', ' + address.state : ''}${address.pincode ? ' – ' + address.pincode : ''}</p>
          <p>📞 ${address.mobile || ''}</p>
        </div>
        <div class="bill-box" style="text-align:right">
          <h4>Sold By</h4>
          <p><strong>SastaaBazaar India Pvt Ltd</strong></p>
          <p>123, Digital Commerce Hub</p>
          <p>Mumbai, Maharashtra – 400001</p>
          <p>GSTIN: 27AABCU9603R1ZX</p>
        </div>
      </div>

      <!-- Items Table -->
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit Price</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals-section">
        <div class="total-row">
          <span>Subtotal</span>
          <span>₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${discount > 0 ? `<div class="total-row discount"><span>Discount</span><span>- ₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="total-row">
          <span>Delivery Charges</span>
          <span>${deliveryCharge === 0 ? '🎁 FREE' : '₹' + deliveryCharge.toLocaleString('en-IN')}</span>
        </div>
        ${gst > 0 ? `<div class="total-row"><span>GST (18%)</span><span>₹${gst.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="grand-total">
          <span>Grand Total</span>
          <span>₹${grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-strip">
      <p>Thank you for shopping with <strong>SastaaBazaar</strong>! 🛒</p>
      <p style="margin-top:6px">For queries, reach us at <strong>support@sastaabazaar.in</strong> | <strong>1800-XXX-XXXX</strong></p>
      <p style="margin-top:4px;font-size:11px;opacity:0.5">This is a computer-generated invoice. No signature required.</p>
    </div>

  </div>
  <script>
    // Auto-trigger print if opened from download button
    if (window.location.hash === '#autoprint') {
      window.onload = () => window.print();
    }
  </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow popups to download the invoice.');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
};
