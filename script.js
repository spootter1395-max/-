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

  alert(`✅ ${count} کارتن از "${productName}" با قیمت ${total.toLocaleString('fa-IR')} تومان به سبد خرید اضافه شد.`);
  // اینجا می‌تونی به آرایه سبد خرید اضافه کنی یا به صفحه فاکتور منتقل بشی
}
