/**
 * MODULE: notify.js
 * Sends email notifications via EmailJS (free tier = 200/month).
 * 
 * Setup:
 *   1. Create account at emailjs.com
 *   2. Add an Email Service (Gmail works)
 *   3. Create two templates: SELLER_TEMPLATE and CUSTOMER_TEMPLATE
 *   4. Fill in CONFIG below
 * 
 * For higher volume: swap sendSeller/sendCustomer to call your own
 * backend endpoint (Node/Express + Nodemailer, etc.)
 */

const Notify = (() => {

  // ─── CONFIG — Fill these in ──────────────────────────────
  const CONFIG = {
    publicKey:        'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId:        'YOUR_EMAILJS_SERVICE_ID',
    sellerTemplateId: 'YOUR_SELLER_TEMPLATE_ID',  // Notifies the warehouse owner of new order
    customerTemplateId: 'YOUR_CUSTOMER_TEMPLATE_ID', // Sends confirmation to buyer
    sellerEmail:      'OWNER@EXAMPLE.COM',         // Warehouse owner's email
  };

  let _initialized = false;

  async function init() {
    if (_initialized) return;
    // EmailJS SDK must be loaded in HTML (see index.html)
    if (window.emailjs) {
      emailjs.init(CONFIG.publicKey);
      _initialized = true;
    }
  }

  /**
   * Format order items for email template
   */
  function _formatItems(items) {
    return items.map(i =>
      `• ${i.name} (Part #${i.partNumber}) × ${i.qty} = $${(i.price * i.qty).toFixed(2)}`
    ).join('\n');
  }

  /**
   * Send new order notification to the warehouse owner
   */
  async function sendSellerNotification(order) {
    await init();
    const params = {
      to_email:     CONFIG.sellerEmail,
      order_number: order.orderNumber,
      order_date:   new Date(order.createdAt).toLocaleString(),
      customer_name: `${order.shipping.firstName} ${order.shipping.lastName}`,
      customer_email: order.shipping.email,
      customer_phone: order.shipping.phone || 'N/A',
      ship_to_name:   `${order.shipping.firstName} ${order.shipping.lastName}`,
      ship_to_addr1:  order.shipping.address,
      ship_to_addr2:  order.shipping.address2 || '',
      ship_to_city:   order.shipping.city,
      ship_to_state:  order.shipping.state,
      ship_to_zip:    order.shipping.zip,
      shipping_method: order.shippingMethod.name,
      items_list:     _formatItems(order.items),
      subtotal:       `$${order.subtotal.toFixed(2)}`,
      shipping_cost:  order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`,
      tax:            `$${order.tax.toFixed(2)}`,
      core_charges:   order.coreTotal > 0 ? `$${order.coreTotal.toFixed(2)}` : '$0.00',
      order_total:    `$${order.total.toFixed(2)}`,
      payment_last4:  order.payment?.last4 || '****',
      notes:          order.notes || 'None',
    };

    if (window.emailjs && CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      return emailjs.send(CONFIG.serviceId, CONFIG.sellerTemplateId, params);
    }
    // Dev fallback: log to console
    console.log('[Notify] Seller notification:', params);
    return Promise.resolve({ status: 200, text: 'dev_mode' });
  }

  /**
   * Send order confirmation to the customer
   */
  async function sendCustomerConfirmation(order) {
    await init();
    const params = {
      to_email:       order.shipping.email,
      to_name:        `${order.shipping.firstName} ${order.shipping.lastName}`,
      order_number:   order.orderNumber,
      order_date:     new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
      items_list:     _formatItems(order.items),
      ship_to_name:   `${order.shipping.firstName} ${order.shipping.lastName}`,
      ship_to_addr1:  order.shipping.address,
      ship_to_addr2:  order.shipping.address2 || '',
      ship_to_city:   order.shipping.city,
      ship_to_state:  order.shipping.state,
      ship_to_zip:    order.shipping.zip,
      shipping_method: order.shippingMethod.name,
      shipping_eta:   order.shippingMethod.days,
      subtotal:       `$${order.subtotal.toFixed(2)}`,
      shipping_cost:  order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`,
      tax:            `$${order.tax.toFixed(2)}`,
      order_total:    `$${order.total.toFixed(2)}`,
    };

    if (window.emailjs && CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      return emailjs.send(CONFIG.serviceId, CONFIG.customerTemplateId, params);
    }
    console.log('[Notify] Customer confirmation:', params);
    return Promise.resolve({ status: 200, text: 'dev_mode' });
  }

  /**
   * Send both notifications at once
   */
  async function sendOrderNotifications(order) {
    const results = await Promise.allSettled([
      sendSellerNotification(order),
      sendCustomerConfirmation(order),
    ]);
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error('[Notify] Some notifications failed:', failures);
    }
    return results;
  }

  return { sendSellerNotification, sendCustomerConfirmation, sendOrderNotifications };
})();

window.Notify = Notify;
