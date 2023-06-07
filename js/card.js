const createCard = (cardData) => 
`<li class="card" data-modal="show">
  <img src="${cardData.img}" alt="${cardData.name} image">
  <p class="card-pet-name">${cardData.name}</p>
  <button class="button card-button button-with-hover">
    Learn more
  </button>
</li>`;

export const setCardsToContainer = (container, cards, itemsCount) => {
  container.innerHTML = "";
  for (let i = 0; i < itemsCount; i++) {
    container.insertAdjacentHTML("beforeend", createCard(cards[i]));
  }
}