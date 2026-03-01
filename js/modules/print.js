/**
 * MODULE: print.js
 * Generates print-ready views for:
 *   - Professional invoice (customer-facing)
 *   - Packing slip (warehouse pick sheet)
 *   - Shipping label (4×6 label format)
 *
 * Usage:
 *   Print.openInvoice(order)        — opens invoice in new tab, triggers print dialog
 *   Print.openPackingSlip(order)    — opens warehouse pick sheet
 *   Print.openShippingLabel(order)  — opens 4×6 shipping label
 *   Print.openCoreReturnForm(order, item) — printable core return form
 */

const Print = (() => {

  // ─── Company info (edit these) ────────────────────────────
  const COMPANY = {
    name:    'AutoParts Warehouse',
    tagline: 'Quality Parts — Fast Shipping',
    address: '1234 Warehouse Drive',
    city:    'Your City, ST 00000',
    phone:   '(555) 555-5555',
    email:   'orders@autopartswarehouse.com',
    website: 'www.autopartswarehouse.com',
    logo:    '⚙',  // Replace with <img> tag for real logo
  };

  function _fmt$(n) { return '$' + Number(n || 0).toFixed(2); }
  function _fmtDate(iso) { return new Date(iso).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }); }

  // ─── Shared CSS ──────────────────────────────────────────
  const BASE_CSS = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #111; background: #fff; }
    h1,h2,h3,h4 { font-family: 'Arial Narrow', Arial, sans-serif; }
    table { width:100%; border-collapse:collapse; }
    @media print {
      @page { margin: 0.5in; }
      .no-print { display:none !important; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  `;

  // ─── Invoice ─────────────────────────────────────────────
  function openInvoice(order) {
    const win = window.open('', '_blank');
    const o = order;
    const subtotal    = o.subtotal || 0;
    const coreTotal   = o.coreTotal || 0;
    const shipCost    = o.shippingCost || 0;
    const tax         = o.tax || 0;
    const total       = o.total || 0;

    const itemRows = (o.items || []).map(i => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;color:#666;font-size:10pt">${i.brand} · ${i.partNumber}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${_fmt$(i.price)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:bold">${_fmt$(i.price * i.qty)}</td>
      </tr>
      ${i.coreCharge > 0 ? `<tr style="background:#fffbeb">
        <td colspan="2" style="padding:4px 8px;font-size:9pt;color:#92400e">↩ Core Charge (refundable — return old part within 90 days)</td>
        <td style="padding:4px 8px;text-align:center;font-size:9pt">${i.qty}</td>
        <td style="padding:4px 8px;text-align:right;font-size:9pt">${_fmt$(i.coreCharge)}</td>
        <td style="padding:4px 8px;text-align:right;font-size:9pt">${_fmt$(i.coreCharge * i.qty)}</td>
      </tr>` : ''}
    `).join('');

    const html = `<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>Invoice ${o.orderNumber}</title>
      <style>
        ${BASE_CSS}
        body { padding: 0.25in; max-width: 8.5in; margin: 0 auto; }
        .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; padding-bottom:20px; border-bottom:3px solid #111; }
        .logo { font-size:28pt; font-weight:900; letter-spacing:0.02em; }
        .logo span { color:#e8a020; }
        .invoice-title { text-align:right; }
        .invoice-title h1 { font-size:24pt; font-weight:900; letter-spacing:0.1em; text-transform:uppercase; }
        .invoice-title .order-num { font-family:monospace; color:#e8a020; font-size:13pt; }
        .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-bottom:32px; }
        .meta-block h4 { font-size:9pt; text-transform:uppercase; letter-spacing:0.1em; color:#666; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:4px; }
        .meta-block p  { font-size:10.5pt; line-height:1.6; }
        .items-table th { background:#111; color:#fff; padding:10px 8px; text-align:left; font-size:9pt; text-transform:uppercase; letter-spacing:0.06em; }
        .items-table th:last-child, .items-table th:nth-child(3), .items-table th:nth-child(4) { text-align:right; }
        .items-table th:nth-child(3) { text-align:center; }
        .totals { margin-top:16px; margin-left:auto; width:320px; }
        .total-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #eee; font-size:10.5pt; }
        .total-row.grand { font-weight:900; font-size:14pt; border-top:2px solid #111; border-bottom:none; padding-top:10px; margin-top:4px; }
        .total-row.grand span:last-child { color:#e8a020; }
        .warranty-section { margin-top:32px; padding:16px; background:#f9f9f9; border:1px solid #ddd; border-radius:4px; font-size:9.5pt; }
        .warranty-section h4 { margin-bottom:8px; text-transform:uppercase; letter-spacing:.06em; font-size:9pt; }
        .footer { margin-top:40px; padding-top:16px; border-top:1px solid #ddd; text-align:center; font-size:9pt; color:#666; }
        .print-btn { position:fixed; top:16px; right:16px; background:#111; color:#fff; border:none; padding:10px 24px; cursor:pointer; font-size:11pt; border-radius:4px; }
      </style>
    </head><body>
      <button class="no-print print-btn" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Invoice</button>

      <div class="header">
        <div>
          <div class="logo">${COMPANY.logo} Auto<span>Parts</span></div>
          <div style="margin-top:8px;font-size:10pt;color:#444">
            ${COMPANY.address}<br>
            ${COMPANY.city}<br>
            ${COMPANY.phone} · ${COMPANY.email}<br>
            ${COMPANY.website}
          </div>
        </div>
        <div class="invoice-title">
          <h1>Invoice</h1>
          <div class="order-num">${o.orderNumber}</div>
          <div style="margin-top:8px;font-size:10pt;color:#444">
            Date: ${_fmtDate(o.createdAt)}<br>
            Payment: Visa ****${o.payment?.last4 || '----'}
          </div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-block">
          <h4>Bill To</h4>
          <p>
            <strong>${o.shipping?.firstName} ${o.shipping?.lastName}</strong><br>
            ${o.shipping?.email || ''}<br>
            ${o.shipping?.phone || ''}
          </p>
        </div>
        <div class="meta-block">
          <h4>Ship To</h4>
          <p>
            <strong>${o.shipping?.firstName} ${o.shipping?.lastName}</strong><br>
            ${o.shipping?.address || ''}${o.shipping?.address2 ? ', ' + o.shipping.address2 : ''}<br>
            ${o.shipping?.city}, ${o.shipping?.state} ${o.shipping?.zip}
          </p>
        </div>
        <div class="meta-block">
          <h4>Shipping Method</h4>
          <p>${o.shippingMethod?.name || '—'}<br><span style="color:#666">${o.shippingMethod?.days || ''}</span></p>
        </div>
        <div class="meta-block">
          <h4>Order Status</h4>
          <p style="text-transform:capitalize;font-weight:700;color:${o.status === 'shipped' || o.status === 'delivered' ? '#166534' : '#92400e'}">${o.status || 'Processing'}</p>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Part Number</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit Price</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>${_fmt$(subtotal)}</span></div>
        ${coreTotal > 0 ? `<div class="total-row"><span>Core Charges</span><span>${_fmt$(coreTotal)}</span></div>` : ''}
        <div class="total-row"><span>Shipping (${o.shippingMethod?.name || '—'})</span><span>${shipCost === 0 ? 'FREE' : _fmt$(shipCost)}</span></div>
        <div class="total-row"><span>Tax</span><span>${_fmt$(tax)}</span></div>
        <div class="total-row grand"><span>Total</span><span>${_fmt$(total)}</span></div>
      </div>

      ${coreTotal > 0 ? `
      <div class="warranty-section" style="margin-top:24px;background:#fffbeb;border-color:#fcd34d">
        <h4>⚠ Core Return Instructions</h4>
        <p>This order includes refundable core charge(s) totaling <strong>${_fmt$(coreTotal)}</strong>. To receive your refund:</p>
        <ol style="margin:8px 0 0 20px;line-height:1.8">
          <li>Package the old/used part securely in the same box your new part arrived in.</li>
          <li>Include this invoice (or write your order number: <strong>${o.orderNumber}</strong>) inside the package.</li>
          <li>Ship to: ${COMPANY.name}, ${COMPANY.address}, ${COMPANY.city}</li>
          <li>Core must be received within <strong>90 days</strong> of purchase date (${_fmtDate(o.createdAt)}).</li>
          <li>Refund issued within 5–7 business days of core receipt.</li>
        </ol>
        <p style="margin-top:8px;font-size:9pt;color:#666">Deadline: ${new Date(new Date(o.createdAt).getTime() + 90*86400000).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
      </div>` : ''}

      ${(o.items || []).some(i => i.specs?.Warranty) ? `
      <div class="warranty-section">
        <h4>Warranty Information</h4>
        ${(o.items || []).filter(i => i.specs?.Warranty).map(i => `
          <p style="margin-top:6px"><strong>${i.name}</strong> (${i.partNumber}): ${i.specs.Warranty} warranty from purchase date.</p>
        `).join('')}
        <p style="margin-top:8px;font-size:9pt;color:#666">To make a warranty claim, contact us with your order number and a description of the issue.</p>
      </div>` : ''}

      <div class="footer">
        <p>${COMPANY.name} — ${COMPANY.tagline}</p>
        <p style="margin-top:4px">${COMPANY.website} · ${COMPANY.phone} · ${COMPANY.email}</p>
        <p style="margin-top:4px">Thank you for your business! All sales final except as noted in our return policy.</p>
      </div>
    </body></html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }

  // ─── Packing Slip ────────────────────────────────────────
  function openPackingSlip(order) {
    const win = window.open('', '_blank');
    const o   = order;

    const itemRows = (o.items || []).map((i, idx) => `
      <tr style="background:${idx % 2 === 0 ? '#fff' : '#f9f9f9'}">
        <td style="padding:10px 8px;border-bottom:1px solid #ddd;text-align:center">
          <div style="width:20px;height:20px;border:2px solid #333;display:inline-block;border-radius:2px"></div>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #ddd;font-weight:600">${i.name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #ddd;font-family:monospace">${i.partNumber}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #ddd">${i.brand}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #ddd;text-align:center;font-size:14pt;font-weight:900">${i.qty}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #ddd;text-align:center">
          <div style="width:20px;height:20px;border:2px solid #333;display:inline-block;border-radius:2px"></div>
        </td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>Packing Slip ${o.orderNumber}</title>
      <style>
        ${BASE_CSS}
        body { padding:0.35in; }
        .header { display:flex; justify-content:space-between; border-bottom:3px solid #111; padding-bottom:12px; margin-bottom:16px; }
        .items-table th { background:#333; color:#fff; padding:8px; font-size:9pt; text-transform:uppercase; letter-spacing:.06em; }
        .print-btn { position:fixed; top:16px; right:16px; background:#111; color:#fff; border:none; padding:10px 24px; cursor:pointer; font-size:11pt; border-radius:4px; }
      </style>
    </head><body>
      <button class="no-print print-btn" onclick="window.print()"><i class="fa-solid fa-print"></i> Print</button>

      <div class="header">
        <div>
          <div style="font-size:18pt;font-weight:900">${COMPANY.logo} PACKING SLIP</div>
          <div style="font-size:10pt;color:#444;margin-top:4px">${COMPANY.name}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:monospace;font-size:14pt;font-weight:900">${o.orderNumber}</div>
          <div style="font-size:10pt;color:#444">Date: ${_fmtDate(o.createdAt)}</div>
          <div style="font-size:10pt;color:#444">Ship Via: ${o.shippingMethod?.name || '—'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #ddd">
        <div>
          <div style="font-size:9pt;text-transform:uppercase;letter-spacing:.06em;color:#666;margin-bottom:6px">Ship To</div>
          <div style="font-size:12pt;font-weight:700">${o.shipping?.firstName} ${o.shipping?.lastName}</div>
          <div>${o.shipping?.address || ''}${o.shipping?.address2 ? ', '+o.shipping.address2 : ''}</div>
          <div>${o.shipping?.city}, ${o.shipping?.state} ${o.shipping?.zip}</div>
          <div style="color:#444;margin-top:4px">${o.shipping?.phone || ''}</div>
        </div>
        <div>
          <div style="font-size:9pt;text-transform:uppercase;letter-spacing:.06em;color:#666;margin-bottom:6px">Items: ${(o.items||[]).reduce((t,i)=>t+i.qty,0)} total</div>
          ${o.shipping?.notes ? `<div style="background:#fffbeb;border:1px solid #fcd34d;padding:8px;border-radius:4px;font-size:10pt"><strong>NOTE:</strong> ${o.shipping.notes}</div>` : ''}
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th style="width:40px;text-align:center">Pick</th>
            <th>Item Description</th>
            <th>Part #</th>
            <th>Brand</th>
            <th style="text-align:center">Qty</th>
            <th style="width:40px;text-align:center">Pack</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      ${(o.items||[]).some(i => i.coreCharge > 0) ? `
      <div style="margin-top:16px;padding:10px;background:#fffbeb;border:1px solid #fcd34d;border-radius:4px;font-size:10pt">
        <strong>⚠ CORE RETURN REQUIRED:</strong> ${(o.items||[]).filter(i=>i.coreCharge>0).map(i=>`${i.name} (${i.partNumber})`).join(', ')}
        — Include core return info in package.
      </div>` : ''}

      <div style="margin-top:20px;text-align:center;font-size:9pt;color:#666;border-top:1px solid #ddd;padding-top:12px">
        ${COMPANY.name} · ${COMPANY.address} · ${COMPANY.city} · ${COMPANY.phone}
      </div>
    </body></html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }

  // ─── Shipping Label (4×6 format) ────────────────────────
  function openShippingLabel(order) {
    const win = window.open('', '_blank');
    const o   = order;

    const html = `<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>Label ${o.orderNumber}</title>
      <style>
        ${BASE_CSS}
        @media print { @page { size: 4in 6in; margin: 0.15in; } }
        body { width:4in; min-height:6in; padding:0.15in; font-family:Arial,sans-serif; }
        .from-block { font-size:9pt; color:#444; margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid #ddd; }
        .to-block { font-size:14pt; font-weight:700; line-height:1.5; margin-bottom:12px; }
        .to-block .name { font-size:16pt; }
        .barcode-placeholder { border:2px dashed #ccc; padding:12px; text-align:center; font-size:9pt; color:#999; margin:8px 0; border-radius:4px; }
        .order-box { background:#111; color:#fff; padding:8px 12px; border-radius:4px; display:flex; justify-content:space-between; margin-top:8px; }
        .method-box { border:2px solid #e8a020; padding:6px 12px; border-radius:4px; text-align:center; font-weight:900; font-size:11pt; margin:8px 0; }
        .print-btn { position:fixed; top:8px; right:8px; background:#111; color:#fff; border:none; padding:6px 16px; cursor:pointer; font-size:10pt; border-radius:4px; }
      </style>
    </head><body>
      <button class="no-print print-btn" onclick="window.print()">Print</button>

      <div class="from-block">
        <strong>FROM:</strong><br>
        ${COMPANY.name}<br>
        ${COMPANY.address}<br>
        ${COMPANY.city}
      </div>

      <div style="font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">SHIP TO:</div>
      <div class="to-block">
        <div class="name">${o.shipping?.firstName} ${o.shipping?.lastName}</div>
        <div>${o.shipping?.address || ''}${o.shipping?.address2 ? ', '+o.shipping.address2 : ''}</div>
        <div>${o.shipping?.city}, ${o.shipping?.state} ${o.shipping?.zip}</div>
        ${o.shipping?.phone ? `<div style="font-size:12pt">${o.shipping.phone}</div>` : ''}
      </div>

      <div class="method-box">${(o.shippingMethod?.name || 'Ground').toUpperCase()}</div>

      <div class="barcode-placeholder">
        ||||| |||||| ||||| |||||| |||||<br>
        [Tracking Number — printed by carrier]<br>
        ||||| |||||| ||||| |||||| |||||
      </div>

      <div class="order-box">
        <span>ORDER: ${o.orderNumber}</span>
        <span>${_fmtDate(o.createdAt)}</span>
      </div>

      ${(o.items||[]).some(i=>i.coreCharge>0) ? `
      <div style="margin-top:8px;border:2px solid #f59e0b;padding:6px;border-radius:4px;font-size:9pt;text-align:center">
        ⚠ CORE RETURN PACKAGE EXPECTED SEPARATELY
      </div>` : ''}

      <div style="margin-top:8px;text-align:center;font-size:8pt;color:#666">
        ${COMPANY.website} · ${COMPANY.phone}
      </div>
    </body></html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }

  // ─── Core Return Form ────────────────────────────────────
  function openCoreReturnForm(order, item) {
    const win = window.open('', '_blank');
    const deadline = new Date(new Date(order.createdAt).getTime() + 90 * 86400000);

    const html = `<!DOCTYPE html><html><head>
      <meta charset="UTF-8"><title>Core Return Form</title>
      <style>
        ${BASE_CSS}
        body { padding:0.5in; max-width:8.5in; margin:0 auto; }
        h1 { font-size:20pt; border-bottom:3px solid #111; padding-bottom:8px; margin-bottom:20px; }
        .field { margin-bottom:14px; }
        .label { font-size:9pt; text-transform:uppercase; letter-spacing:.06em; color:#666; margin-bottom:4px; }
        .value { font-size:12pt; font-weight:600; }
        .box { border:2px solid #ddd; padding:16px; border-radius:4px; margin:16px 0; }
        .print-btn { position:fixed; top:16px; right:16px; background:#111; color:#fff; border:none; padding:10px 24px; cursor:pointer; border-radius:4px; }
        .deadline { background:#fffbeb; border:2px solid #f59e0b; padding:12px; border-radius:4px; font-size:11pt; font-weight:700; }
      </style>
    </head><body>
      <button class="no-print print-btn" onclick="window.print()"><i class="fa-solid fa-print"></i> Print</button>
      <div style="display:flex;justify-content:space-between;margin-bottom:24px">
        <div><div style="font-size:22pt;font-weight:900">${COMPANY.logo} Auto<span style="color:#e8a020">Parts</span></div><div style="color:#444">${COMPANY.name}</div></div>
        <div style="text-align:right"><h1 style="border:none;margin:0;font-size:18pt">CORE RETURN FORM</h1><div style="font-family:monospace;font-size:12pt;color:#e8a020">${order.orderNumber}</div></div>
      </div>
      <div class="deadline">⏰ Return Deadline: ${deadline.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})} (90 days from purchase)</div>
      <div class="box">
        <div class="field"><div class="label">Customer</div><div class="value">${order.shipping?.firstName} ${order.shipping?.lastName}</div></div>
        <div class="field"><div class="label">Order Number</div><div class="value" style="font-family:monospace">${order.orderNumber}</div></div>
        <div class="field"><div class="label">Purchase Date</div><div class="value">${_fmtDate(order.createdAt)}</div></div>
      </div>
      <div class="box">
        <div class="field"><div class="label">Part Being Returned (Core)</div><div class="value">${item?.name || 'See order'}</div></div>
        <div class="field"><div class="label">Part Number</div><div class="value" style="font-family:monospace">${item?.partNumber || '—'}</div></div>
        <div class="field"><div class="label">Core Charge Refund Amount</div><div class="value" style="color:#e8a020">${_fmt$(item?.coreCharge || 0)}</div></div>
      </div>
      <div class="box">
        <strong>Instructions:</strong>
        <ol style="margin:10px 0 0 20px;line-height:2">
          <li>Place the old/used part in the original box or equivalent packaging.</li>
          <li>Include THIS form inside the package.</li>
          <li>Ship to: <strong>${COMPANY.name}, ${COMPANY.address}, ${COMPANY.city}</strong></li>
          <li>Email us your tracking number: <strong>${COMPANY.email}</strong></li>
          <li>Core refund of <strong>${_fmt$(item?.coreCharge || 0)}</strong> will be issued within 5–7 business days of receipt.</li>
        </ol>
      </div>
      <div style="margin-top:20px;text-align:center;font-size:9pt;color:#666;border-top:1px solid #ddd;padding-top:12px">
        Questions? ${COMPANY.phone} · ${COMPANY.email} · ${COMPANY.website}
      </div>
    </body></html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }

  return { openInvoice, openPackingSlip, openShippingLabel, openCoreReturnForm };
})();

window.Print = Print;
