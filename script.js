function updatePrice(id, normalPrice, bulkPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${id}`).value);
  const price = count >= 21 ? bulkPrice : normalPrice;
  document.getElementById(`priceLabel-${id}`).innerText = `قیمت فعلی: ${price.toLocaleString()} تومان`;
  document.getElementById(`finalPrice-${id}`).innerText = price.toLocaleString();
}

let cart = [];

function addToCart(id, name, normalPrice, bulkPrice) {
  const count = parseInt(document.getElementById(`cartonCount-${id}`).value);
  const price = count >= 21 ? bulkPrice : normalPrice;
  const unitPrice = count >= 21 ? Math.round(bulkPrice / 12) : Math.round(normalPrice / 12);
  cart.push({ name, count, price, unitPrice, type: count >= 21 ? "حجمی" : "نقدی" });
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.innerHTML = `
      <p><strong>${index + 1}. ${item.name}</strong> | تعداد: ${item.count} کارتن | قیمت هر عدد: ${item.unitPrice.toLocaleString()} تومان | قیمت کل: ${item.price.toLocaleString()} تومان | نوع: ${item.type}</p>
    `;
    container.appendChild(row);
    total += item.price;
  });
  document.getElementById("cartTotal").innerText = total.toLocaleString();
  renderInvoice();
}

function renderInvoice() {
  const container = document.getElementById("invoiceTable");
  container.innerHTML = "<h4>🧾 فاکتور رسمی</h4>";
  let total = 0;
  cart.forEach((item, index) => {
    const row = document.createElement("p");
    row.innerHTML = `${index + 1}. ${item.name} | ${item.count} کارتن | ${item.count * 12} بسته | ${item.unitPrice.toLocaleString()} تومان | ${item.price.toLocaleString()} تومان | ${item.type}`;
    container.appendChild(row);
    total += item.price;
  });
  const totalRow = document.createElement("p");
  totalRow.innerHTML = `<strong>جمع کل: ${total.toLocaleString()} تومان</strong>`;
  container.appendChild(totalRow);
}

function sendInvoice() {
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const note = document.getElementById("customerNote").value;
  let message = `🧾 فاکتور خرید\n`;
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} | ${item.count} کارتن | ${item.count * 12} بسته | ${item.unitPrice.toLocaleString()} تومان | ${item.price.toLocaleString()} تومان | ${item.type}\n`;
  });
  message += `\n👤 مشتری: ${name}\n📱 موبایل: ${phone}\n📝 توضیحات: ${note}`;
  const link = `https://wa.me/989154353956?text=${encodeURIComponent(message)}`;
  document.getElementById("whatsappLink").innerHTML = `<a href="${link}" target="_blank">📤 ارسال به واتساپ</a>`;
}

function copyToClipboard(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ کپی شد: " + text);
  });
}
