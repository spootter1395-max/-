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

  let message = `🧾 فاکتور خرید:\n👤 مشتری: ${name}\n📱 موبایل: ${phone}\n`;
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

  const linkContainer = document.getElementById('whatsappLink');
  linkContainer.innerHTML = `
    <p style="color:green; font-weight:bold;">✅ فاکتور با موفقیت ساخته شد. روی دکمه زیر بزن تا در واتساپ باز بشه:</p>
    <a href="${url}" target="_blank" class="whatsapp-button">📤 ارسال فاکتور در واتساپ</a>
  `;

  // ذخیره سفارش در حال بررسی
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push({
    id: Date.now(),
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

window.onload = () => {
  renderCart();
  renderOrders();
  document.getElementById('customerName').value = localStorage.getItem('customerName') || '';
  document.getElementById('customerPhone').value = localStorage.getItem('customerPhone') || '';
  document.getElementById('customerNote').value = localStorage.getItem('customerNote') || '';
};
