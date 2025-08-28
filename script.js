function showDescription(text) {
  alert(text);
}

function playAudio(file) {
  const audio = new Audio(file);
  audio.play();
}

const cart = [];

function addToCart(id, price) {
  cart.push({ id, price });
  alert("محصول به سبد خرید اضافه شد!");
}
