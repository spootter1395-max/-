document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/data/tools.json")
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector(".tools");
      data.forEach(tool => {
        const card = document.createElement("div");
        card.className = "tool-card";
        card.innerHTML = `
          <h3>${tool.title}</h3>
          <p>${tool.description}</p>
          <button onclick="location.href='${tool.link}'">ورود</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error("خطا در بارگذاری ابزارها:", err));
});
