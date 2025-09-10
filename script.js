let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updatePrice(productId, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  let pricePerCarton;
  let label;

  if (count >= 21) {
    pricePerCarton = promoPrice;
    label = `قیمت با طرح حجمی: ${pricePerCarton.toLocaleString('fa-IR')} تومان`;
  } else {
    pricePerCarton = discountPrice;
    label = `قیمت با ۳٪ نقدی: ${pricePerCarton.toLocaleString('fa-IR')} تومان`;
  }

  const total = pricePerCarton * count;
  document.getElementById(`priceLabel-${productId}`).innerText = label;
  document.getElementById(`finalPrice-${productId}`).innerText = total.toLocaleString('fa-IR');
}

function addToCart(productId, productName, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  let pricePerCarton;
  let promoActive = false;

  if (count >= 21) {
    pricePerCarton = promoPrice;
    promoActive = true;
  } else {
    pricePerCarton = discountPrice;
  }

  const total = pricePerCarton * count;

  cart.push({
    id: productId,
    name: productName,
    count,
    price: pricePerCarton,
    total,
    promoActive
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`✅ ${count} کارتن از "${productName}" به سبد خرید اضافه شد.`);
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
        <p>نوع قیمت: ${item.promoActive ? 'طرح حجمی' : '۳٪ نقدی'}</p>
        <button onclick="removeFromCart(${index})">❌ حذف</button>
      </div>
    `;
  });

  document.getElementById('cartTotal').innerText = total.toLocaleString('fa-IR');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
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

  localStorage.setItem('customerName', name);
  localStorage.setItem('customerPhone', phone);
  localStorage.setItem('customerNote', note);

  let message = `🧾 فاکتور فروش - پخش آذرخش\n\n`;
  message += `ردیف | نام کالا              | تعداد | پایه    | ۳٪ نقدی | طرح حجمی | مبلغ نهایی\n`;
  message += `-----|------------------------|--------|---------|---------|-----------|--------------\n`;

  let total = 0;
  cart.forEach((item, i) => {
    const base = Math.round(item.price / (item.promoActive ? 0.89 : 0.97));
    const discount = Math.round(base * 0.97);
    const promo = Math.round(base * 0.89);
    const line = `${(i+1).toString().padEnd(5)}| ${item.name.padEnd(24)}| ${item.count.toString().padEnd(7)}| ${base.toLocaleString('fa-IR').padEnd(8)}| ${discount.toLocaleString('fa-IR').padEnd(8)}| ${promo.toLocaleString('fa-IR').padEnd(10)}| ${item.total.toLocaleString('fa-IR')}`;
    message += line + "\n";
    total += item.total;
  });

  const orderId = Date.now();
  const orderDate = new Date().toLocaleDateString('fa-IR');

  message += `\n💰 جمع کل: ${total.toLocaleString('fa-IR')} تومان`;
  message += `\n📦 نوع قیمت‌گذاری: ${cart.every(i => i.promoActive) ? 'طرح ویژه' : '۳٪ نقدی'}`;
  message += `\n🕒 تاریخ: ${orderDate}`;
  message += `\n🔖 کد سفارش: AZ${orderId.toString().slice(-6)}`;
  message += `\n👤 مشتری: ${name} | 📱 ${phone}`;

  const encoded = encodeURIComponent(message);
  const sellerPhone = "989154353956";
  const url = `https://wa.me/${sellerPhone}?text=${encoded}`;

  const linkContainer = document.getElementById('whatsappLink');
  linkContainer.innerHTML = `
    <p style="color:green; font-weight:bold;">✅ فاکتور با موفقیت ساخته شد. روی دکمه زیر بزن تا در واتساپ باز بشه:</p>
    <a href="${url}" target="_blank" class="whatsapp-button">📤 ارسال فاکتور در واتساپ</a>
  `;

  // ذخیره سفارش در حال بررسی
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push({
    id: orderId,
    date: orderDate,
    customer: { name, phone, note },
    items: cart,
    total
  });
  localStorage.setItem('orders', JSON.stringify(orders));

  // پاک‌سازی سبد و فرم
  cart = [];
  localStorage.removeItem('cart');
  renderCart();
  document.getElementById('customerForm').reset();
  renderOrders();
  renderInvoiceTable(orders[orders.length - 1]);
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const container = document.getElementById('orderList');
  container.innerHTML = '';

  orders.forEach(order => {
    container.innerHTML += `
      <div class="cart-item">
        <p>👤 ${order.customer.name} | 📱 ${order.customer.phone}</p>
        <p>📝 ${order.customer.note || 'بدون توضیح'}</p>
        <p>💰 جمع کل: ${order.total.toLocaleString('fa-IR')} تومان</p>
        <ul>
          ${order.items.map(i => `<li>${i.name} - ${i.count} کارتن</li>`).join('')}
        </ul>
      </div>
    `;
  });
}

function renderInvoiceTable(order) {
  const container = document.getElementById('invoiceTable');
  let html = `
    <table class="invoice-table">
      <thead>
        <tr>
          <th>ردیف</th>
          <th>نام کالا</th>
          <th>تعداد</th>
          <th>قیمت پایه</th>
          <th>۳٪ نقدی</th>
          <th>طرح حجمی</th>
          <th>مبلغ نهایی</th>
        </tr>
      </thead>
      <tbody>
  `;

  order.items.forEach((item, i) => {
    const base = Math.round(item.price / (item.promoActive ? 0.89 : 0.97));
    const discount = Math.round(base * 0.97);
    const promo = Math.round(base * 0.89);
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td>${item.count}</td>
        <td>${base.toLocaleString('fa-IR')}</td>
        <td>${discount.toLocaleString('fa-IR')}</td>
        <td>${promo.toLocaleString('fa-IR')}</td>
        <td>${item.total.toLocaleString('fa-IR')}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p><strong>💰 جمع کل:</strong> ${order.total.toLocaleString('fa-IR')} تومان</p>
    <p><strong>📦 نوع قیمت‌گذاری:</strong> ${order.items.every(i => i.promoActive) ? 'طرح ویژه' : '۳٪ نقدی'}</p>
    <p><strong>🕒 تاریخ:</strong> ${order.date}</p>
    <p><strong>🔖 کد سفارش:</
