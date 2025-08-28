// موسیقی پس‌زمینه
function toggleMusic() {
  const music = document.getElementById("bg-music");
  const button = document.getElementById("music-toggle");

  if (music.paused) {
    music.play();
    button.innerText = "🔊 موسیقی";
  } else {
    music.pause();
    button.innerText = "🔇 قطع موسیقی";
  }
}

// نمایش دسته‌بندی‌ها
function showCategory(category) {
  closeAllCategories();
  document.getElementById(category).style.display = "block";
}

function closeAllCategories() {
  document.querySelectorAll(".category-section").forEach(el => {
    el.style.display = "none";
  });
}

// بارگذاری محصولات
fetch('tools.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('product-list');
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>قیمت پایه: ${item.price.toLocaleString()} تومان</p>
        <button onclick="showDescription('${item.description}')">📄 توضیحات</button>
        <button onclick="playAudio('${item.audio}')">🔊 صدا</button>
        <button onclick="addToCart('${item.id}', ${item.price})">➕ افزودن به سبد خرید</button>
      `;
      container.appendChild(card);
    });
  });

function showDescription(text) {
  alert(text);
}

function playAudio(file) {
  const audio = new Audio(file);
  audio.play();
}

// سبد خرید
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
  const checkbox = document.getElementById("cash-checkbox");
  return checkbox && checkbox.checked;
}

function submitOrder() {
  alert("سفارش ثبت شد! اطلاعات برای شما ارسال می‌شود.");
}
