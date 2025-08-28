const cart = [];

function addToCart(id, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, price, quantity: 1, discount: 0 });
  }
  updateCartDisplay();
}

function updateCartDisplay() {
  const tbody = document.querySelector("#cart-table tbody");
  tbody.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    // تخفیف نقدی
    let discount = 0;
    if (item.quantity >= 60) discount += 5;
    if (isCashPurchase()) discount += 3;

    const finalPrice = item.price * item.quantity * (1 - discount / 100);
    total += finalPrice;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()}</td>
      <td>${discount}%</td>
      <td>${finalPrice.toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("cart-total").textContent = total.toLocaleString();
}

function isCashPurchase() {
  // فرضاً یه چک‌باکس داریم برای خرید نقدی
  const checkbox = document.getElementById("cash-checkbox");
  return checkbox && checkbox.checked;
}

function submitOrder() {
  alert("سفارش ثبت شد! اطلاعات برای شما ارسال می‌شود.");
  // اینجا می‌تونی اتصال به واتساپ، ایمیل یا پنل مدیریت بزنی
}
