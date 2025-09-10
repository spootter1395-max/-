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

  let message = `🧾 فاکتور خرید:\n👤 مشتری: ${name}\n📱 موبایل: ${phone}\n`;
  if (note) message += `📝 توضیحات: ${note}\n`;

  let[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/Pardis-K/Doctor-Appointment/tree/5da8f6d7847dc7b98f9bbdd1ba83a09a1c39c8ef/views%2Flayout%2Fdoctor.blade.php?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")
