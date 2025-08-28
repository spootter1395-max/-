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
