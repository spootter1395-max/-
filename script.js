let cart = [];

function updatePrice(productId, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  const isPromo = count >= 21;
  const pricePerCarton = isPromo ? promoPrice : discountPrice;
  const total = pricePerCarton * count;

  document.getElementById(`priceLabel-${productId}`).innerText =
    isPromo
      ? `قیمت با طرح حجمی: ${pricePerCarton.toLocaleString('fa-IR')} تومان`
      : `قیمت با ۳٪ نقدی: ${pricePerCarton.toLocaleString('fa-IR')} تومان`;

  document.getElementById(`finalPrice-${productId}`).innerText = total.toLocaleString('fa-IR');
}

function addToCart(productId, productName, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  const isPromo = count >= 21;
  const pricePerCarton = isPromo ? promoPrice : discountPrice;
  const total = pricePerCarton * count;

  cart.push({
    name: productName,
    count,
    price: pricePerCarton,
    total,
    promo: isPromo
  });

  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  container.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.total;
    container.innerHTML += `
      <div class="cart-item">
        <p>${item.name} | ${item.count} کارتن | ${item.price.toLocaleString('fa-IR')} تومان/کارتن</p>
        <p>قیمت کل: ${item.total.toLocaleString('fa-IR')} تومان</p>
        <p>نوع قیمت: ${item.promo ? 'طرح حجمی' : '۳٪ نقدی'}</p>
        <button onclick="removeFromCart(${index})">❌ حذف</button>
      </div>
    `;
  });

  document.getElementById('cartTotal').innerText = total.toLocaleString('fa-IR');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function sendInvoice() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const note = document.getElementById('customerNote').value.trim();

  if (!name || !phone) {
    alert("لطفاً نام و شماره موبایل را وارد کنید.");
    return;
  }

  let message = `🧾 فاکتور خرید\n👤 مشتری: ${name}\n📱 موبایل: ${phone}\n`;
  if (note) message += `📝 توضیحات: ${note}\n`;

  let total = 0;
  cart.forEach(item => {
    message += `• ${item.name} - ${item.count} کارتن - ${item.total.toLocaleString('fa-IR')} تومان\n`;
    total += item.total;
  });

  message += `\n💰 جمع کل: ${total.toLocaleString('fa-IR')} تومان`;

  const encoded = encodeURIComponent(message);
  const sellerPhone = "989154353956";
  const url = `https://wa.me/${sellerPhone}?text=${encoded}`;

  document.getElementById('whatsappLink').innerHTML = `
    <p style="color:green; font-weight:bold;">✅ فاکتور آماده شد. روی دکمه زیر بزن:</p>
    <a href="${url}" target="_blank" class="whatsapp-button">📤 ارسال در واتساپ</a>
    <button onclick="window.print()" style="margin-top:10px;">🖨️ چاپ فاکتور</button>
  `;

  // نمایش پیش‌نمایش فاکتور
  renderInvoiceTable({
    customer: { name, phone, note },
    items: cart,
    total
  });

  // ذخیره سفارش در localStorage
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push({
    customer: { name, phone, note },
    items: cart,
    total,
    date: new Date().toLocaleString('fa-IR')
  });
  localStorage.setItem('orders', JSON.stringify(orders));
  renderOrders();

  cart = [];
  renderCart();
  document.getElementById('customerForm').reset();
}

function renderInvoiceTable(order) {
  const container = document.getElementById('invoiceTable');
  let html = `<ul style="list-style:none; padding:0;">`;

  order.items.forEach((item, i) => {
    html += `
      <li style="margin-bottom:10px;">
        <strong>${i + 1}. ${item.name}</strong><br>
        تعداد: ${item.count} کارتن<br>
        قیمت واحد: ${item.price.toLocaleString('fa-IR')} تومان<br>
        مبلغ نهایی: ${item.total.toLocaleString('fa-IR')} تومان<br>
        نوع قیمت: ${item.promo ? 'طرح حجمی' : '۳٪ نقدی'}
      </li>
    `;
  });

  html += `</ul>`;
  html += `<p><strong>💰 جمع کل:</strong> ${order.total.toLocaleString('fa-IR')} تومان</p>`;
  html += `<p><strong>👤 مشتری:</strong> ${order.customer.name} | 📱 ${order.customer.phone}</p>`;
  if (order.customer.note) {
    html += `<p><strong>📝 توضیحات:</strong> ${order.customer.note}</p>`;
  }

  container.innerHTML = html;
}

function renderOrders() {
  const container = document.getElementById('orderList');
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (orders.length === 0) {
    container.innerHTML = "<p>هیچ سفارشی ثبت نشده.</p>";
    return;
  }

  container.innerHTML = '';
  orders.forEach((order, i) => {
    let html = `<div class="cart-item"><strong>سفارش ${i + 1}</strong><br>`;
    html += `👤 ${order.customer.name} | 📱 ${order.customer.phone}<br>`;
    html += `🕒 تاریخ: ${order.date}<br>`;
    html += `💰 جمع کل: ${order.total.toLocaleString('fa-IR')} تومان<br>`;
    html += `<ul style="list-style:none; padding:0;">`;
    order.items.forEach(item => {
      html += `<li>• ${item.name} - ${item.count} کارتن - ${item.total.toLocaleString('fa-IR')} تومان</li>`;
    });
    html += `</ul></div>`;
    container.innerHTML += html;
  });
}

window.onload = () => {
  renderCart();
  renderOrders();
  document.getElementById('customerName').value = localStorage.getItem('customerName') || '';
  document.getElementById('customerPhone').value = localStorage.getItem('customerPhone') || '';
  document.getElementById('customerNote').value = localStorage.getItem('customerNote') || '';
};
