let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updatePrice(productId, basePrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  const promo = document.getElementById(`promoToggle-${productId}`).checked;
  const pricePerCarton = promo ? promoPrice : basePrice;
  const total = pricePerCarton * count;
  document.getElementById(`finalPrice-${productId}`).innerText = total.toLocaleString('fa-IR');
}

function addToCart(productId, productName, basePrice, promoPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${productId}`).value);
  const promo = document.getElementById(`promoToggle-${productId}`).checked;
  const pricePerCarton = promo ? promoPrice : basePrice;
  const total = pricePerCarton * count;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.count += count;
    existing.total += total;
  } else {
    cart.push({ id: productId, name: productName, count, price: pricePerCarton, total });
  }

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

  let total = 0;
  cart.forEach(item => {
    message += `• ${item.name} - ${item.count} کارتن - ${item.total.toLocaleString('fa-IR')} تومان\n`;
    total += item.total;
  });

  message += `\n💰 جمع کل: ${total.toLocaleString('fa-IR')} تومان`;
  const encoded = encodeURIComponent(message);
  const sellerPhone = "989154353956";
  const url = `https://wa.me/${sellerPhone}?text=${encoded}`;
  window.open(url, '_blank');
}

window.onload = renderCart;
