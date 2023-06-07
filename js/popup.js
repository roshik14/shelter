import { getCards } from "./json_reader.js";

const MODAL_WINDOW = document.querySelector(".modal");
const CLOSE_BTN = document.querySelector(".modal-close-btn");

MODAL_WINDOW.addEventListener("click", function(event) {
  if (!event.target.hasAttribute("data-close")) {
    return;
  }
  closeWindow();
});

CLOSE_BTN.addEventListener("click", function() {
  closeWindow();
})

const showModal = (event, cards) => {
  const li = event.target.closest("[data-modal]");
  if (!li) {
    return;
  }
  const name = li.querySelector(".card-pet-name").textContent;
  const cardData = cards.filter(x => x.name == name)[0];
  showModalWithData(cardData);
  document.body.classList.add("disable-scrolling");
}

getCards().then((json) => {
  const container = document.querySelector(".cards-container");
  container.addEventListener("click", function(event) {
    showModal(event, json);
  });
});

const showModalWithData = (cardData) => {
  const content = MODAL_WINDOW.querySelector(".modal-content");
  content.innerHTML = "";
  content.insertAdjacentHTML("beforeend", getHtml(cardData));
  MODAL_WINDOW.style.display = "block";
}

const closeWindow = () => {
  MODAL_WINDOW.style.display = "none";
  document.body.classList.remove("disable-scrolling");
}

const getHtml = (data) =>
  `<img src="${data.img}" alt="pet image">
  <div class="modal-text-content">
    <h4 class="section-header modal-header">${data.name}</h4>
    <p class="modal-subtitle">${data.type} - ${data.breed}</p>
    <p class="paragraph-text modal-description">
      ${data.description}
    </p>
    <ul class="flex-container modal-list">
      <li class="modal-list-item">
        <b>Age:</b> ${data.age}
      </li>
      <li class="modal-list-item">
        <b>Inoculations:</b> ${data.inoculations.join(",")}
      </li>
      <li class="modal-list-item">
        <b>Diseases:</b> ${data.diseases.join(",")}
      </li>
      <li class="modal-list-item">
        <b>Parasites:</b> ${data.parasites.join(",")}
      </li>
    </ul>
  </div>`