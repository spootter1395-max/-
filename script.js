let cart = [];

function updatePrice(productId, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  if (isNaN(count) || count <= 0) return;

  let pricePerCarton;
  let priceType;

  if (productId === 3 && count >= 20) {
    pricePerCarton = Math.round(promoPrice * 0.97);
    priceType = 'طرح تشویقی';
  } else if (count >= 21) {
    pricePerCarton = Math.round(promoPrice * 0.97);
    priceType = 'طرح حجمی';
  } else {
    pricePerCarton = discountPrice;
    priceType = '۳٪ نقدی';
  }

  const total = pricePerCarton * count;

  document.getElementById(`priceLabel-${productId}`).innerText =
    `${priceType}: ${pricePerCarton.toLocaleString('fa-IR')} تومان`;
  document.getElementById(`finalPrice-${productId}`).innerText = total.toLocaleString('fa-IR');
}

function addToCart(productId, productName, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  if (isNaN(count) || count <= 0) return;

  let pricePerCarton;
  let priceType;

  if (productId === 3 && count >= 20) {
    pricePerCarton = Math.round(promoPrice * 0.97);
    priceType = 'طرح تشویقی';
  } else if (count >= 21) {
    pricePerCarton = Math.round(promoPrice * 0.97);
    priceType = 'طرح حجمی';
  } else {
    pricePerCarton = discountPrice;
    priceType = '۳٪ نقدی';
  }

  const unitPrice = Math.round(pricePerCarton / 12);
  const total = pricePerCarton * count;

  cart.push({ name: productName, count, unitPrice, price: pricePerCarton, total, priceType });
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
        <p>${item.name} | ${item.count} کارتن</p>
        <p>قیمت کارتن: ${item.price.toLocaleString('fa-IR')} تومان</p>
        <p>قیمت هر عدد: ${item.unitPrice.toLocaleString('fa-IR')} تومان</p>
        <p>قیمت کل: ${item.total.toLocaleString('fa-IR')} تومان</p>
        <p>نوع قیمت: ${item.priceType}</p>
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
    <p style="color:green; font-weight:bold;">✅ فاکتور آماده شد:</p>
    <a href="${url}" target="_blank" class="whatsapp-button">📤 ارسال در واتساپ</a>
    <button onclick="printInvoice()" class="print-button">🖨️ چاپ فاکتور</button>
  `;

  renderInvoiceTable({ customer: { name, phone, note }, items: cart, total });
  cart = [];
  renderCart();
  document.getElementById('customerForm').reset();
}

function renderInvoiceTable(order) {
  const container = document.getElementById('invoiceTable');
  const invoiceNumber = 'AZ-' + Date.now().toString().slice(-6);
  const today = new Date().toLocaleDateString('fa-IR');

  let html = `
    <div class="invoice-header">
      <p><strong>شماره فاکتور:</strong> ${invoiceNumber}</p>
      <p><strong>تاریخ:</strong> ${today}</p>
    </div>
    <table class="invoice-table">
      <thead>
        <tr>
          <th>ردیف</th>
          <th>نام کالا</th>
          <th>تعداد کارتن</th>
          <th>تعداد بسته</th>
          <th>قیمت هر عدد</th>
          <th>قیمت کارتن</th>
          <th>قیمت نهایی</th>
          <th>نوع قیمت</th>
        </tr>
      </thead>
      <tbody>
  `;

  order.items.forEach((item, i) => {
    const totalUnits = item.count * 12;
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td>${item.count}</td>
        <td>${totalUnits}</td>
        <td>${item.unitPrice.toLocaleString('fa-IR')}</td>
        <td>${item.price.toLocaleString('fa-IR')}</td>
        <td>${item.total.toLocaleString('fa-IR')}</td>
        <td>${item.priceType}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p><strong>💰 جمع کل:</strong> ${order.total.toLocaleString('fa-IR')} تومان</p>
    <p><strong>👤 مشتری:</strong> ${order.customer.name} | 📱 ${order.customer.phone}</p>
  `;

  if (order.customer.note) {
    html += `<p><strong>📝 توضیحات:</strong> ${order.customer.note}</p>`;
  }

  html += `
    <div class="invoice-signature">
      <p>شماره کارت جهت پرداخت: <strong>5041 7211 1312 8343</strong> به نام <strong>قیامی</strong></p>
    </div>
  `;

  container.innerHTML = html;
}

function printInvoice() {
  window.print();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function playClickSound() {
  const audio = new Audio('click.mp3');
  audio.play();
}

window.onload = () => {
  renderCart();
};
