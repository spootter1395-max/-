let cart = [];

function updatePrice(productId, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  if (isNaN(count) || count <= 0) return;

  let pricePerCarton = count >= 21 ? Math.round(promoPrice * 0.97) : discountPrice;
  let priceType = count >= 21 ? 'طرح حجمی' : '۳٪ نقدی';
  const total = pricePerCarton * count;

  document.getElementById(`priceLabel-${productId}`).innerText =
    `${priceType}: ${pricePerCarton.toLocaleString('fa-IR')} تومان`;
  document.getElementById(`finalPrice-${productId}`).innerText = total.toLocaleString('fa-IR');
}

function addToCart(productId, productName, discountPrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  if (isNaN(count) || count <= 0) return;

  let pricePerCarton = count >= 21 ? Math.round(promoPrice * 0.97) : discountPrice;
  let priceType = count >= 21 ? 'طرح حجمی' : '۳٪ نقدی';
  let unitPrice = Math.round(pricePerCarton / 12);

  const total = pricePerCarton * count;

  cart.push({ productId, name: productName, count, unitPrice, price: pricePerCarton, total, priceType });
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
    alert("نام و شماره موبایل الزامی است.");
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

  document.getElement[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/Pardis-K/Doctor-Appointment/tree/5da8f6d7847dc7b98f9bbdd1ba83a09a1c39c8ef/views%2Flayout%2Fdoctor.blade.php?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")
