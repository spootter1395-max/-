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
  `;

  cart = [];
  renderCart();
  document.getElementById('customerForm').reset();
}
