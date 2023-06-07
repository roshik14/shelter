"use strict";
import { setCardsToContainer } from "./card.js";
import { getCards } from "./json_reader.js";

const FIRST_PAGE_BTN = document.querySelector(".pagination-first-button");
const PREV_BTN = document.querySelector(".pagination-prev-button");
const NEXT_BTN = document.querySelector(".pagination-next-button");
const LAST_PAGE_BTN = document.querySelector(".pagination-last-button");
const CURRENT_BTN = document.querySelector(".pagination-current-button");
const PAGINATIONS = document.querySelector(".paginations-container");

const TABLET_MAX = 1100;
const MOBILE_MAX = 630;

const handleNextBtn = (state) => {
  showNextPage(state.paginations, state.current, state.current - 1);
  CURRENT_BTN.textContent = ++state.current;
  setDisabledValue(false, FIRST_PAGE_BTN, PREV_BTN);
  if (state.current >= state.sizes.total) {
    setDisabledValue(true, NEXT_BTN, LAST_PAGE_BTN);
  }
}

const handlePrevBtn = (state) => {
  CURRENT_BTN.textContent = --state.current;
  showNextPage(state.paginations, state.current - 1, state.current);
  if (state.current == 1) {
    setDisabledValue(true, FIRST_PAGE_BTN, PREV_BTN);
  }
  if (NEXT_BTN.disabled) {
    setDisabledValue(false, NEXT_BTN, LAST_PAGE_BTN);
  }
}

const handleFirstPageBtn = (state) => {
  showNextPage(state.paginations, 0, state.current - 1);
  state.current = 1;
  CURRENT_BTN.textContent = state.current;
  setDisabledValue(true, FIRST_PAGE_BTN, PREV_BTN);
  setDisabledValue(false, NEXT_BTN, LAST_PAGE_BTN);
}

const handleLastPageBtn = (state) => {
  showNextPage(state.paginations, state.paginations.length - 1, state.current - 1);
  state.current = state.sizes.total;
  CURRENT_BTN.textContent = state.current;
  setDisabledValue(false, FIRST_PAGE_BTN, PREV_BTN);
  setDisabledValue(true, NEXT_BTN, LAST_PAGE_BTN);
}

const handleMediaQuery = (state) => {
  state.sizes = calculateSizes();
  state.paginations = init(state.cards, state.sizes);
  state.current = 2;
  handleFirstPageBtn(state);
}

getCards().then((json) => {
  let sizes = calculateSizes();
  const cards = generateCards(json);
  const paginations = init(cards, sizes);
  let state = {
    current: 1,
    sizes: sizes,
    cards: cards,
    paginations: paginations,
  };
  NEXT_BTN.addEventListener("click", handleNextBtn.bind(null, state));
  PREV_BTN.addEventListener("click", handlePrevBtn.bind(null, state));
  FIRST_PAGE_BTN.addEventListener("click", handleFirstPageBtn.bind(null, state));
  LAST_PAGE_BTN.addEventListener("click", handleLastPageBtn.bind(null, state));
  addListenersToMediaQueries(state);  
});

const addListenersToMediaQueries = (state) => {
  const tableMedia = window.matchMedia(`(max-width: ${TABLET_MAX}px)`);
  const mobileMedia = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
  const desktopMedia = window.matchMedia(`(min-width: ${TABLET_MAX + 1}px)`);
  tableMedia.addEventListener("change", handleMediaQuery.bind(null, state));
  mobileMedia.addEventListener("change", handleMediaQuery.bind(null, state));
  desktopMedia.addEventListener("change", handleMediaQuery.bind(null, state));
}

const init = (cards, sizes) => {
  generatePages(sizes.total);
  const paginations = document.querySelectorAll(".pagination");
  update(cards, sizes.offset, paginations);
  return paginations;
}

const update = (cards, offset, paginations) => {
  for (let i = 1; i < PAGINATIONS.children.length; i++) {
    PAGINATIONS.children[i].style.display = "none";
  }
  let startIndex = 0;
  for (let i = 0; i < paginations.length; i++) {
    const current = cards.slice(startIndex, startIndex + offset);
    setCardsToContainer(paginations[i], current, current.length);
    startIndex += current.length;
  }
  setDisabledValue(true, FIRST_PAGE_BTN, PREV_BTN);
}

const generatePages = (count) => {
  PAGINATIONS.innerHTML = "";
  let html = '<ul class="flex-container pagination"></ul>';
  for (let i = 0; i < count; i++) {
    PAGINATIONS.insertAdjacentHTML("beforeend", html);
  }
}

const generateCards = (cards) => {
  const size = 6;
  const result = [];
  const sequences = [];
  for (let i = 0; i < size; i++) {
    let sequence;
    do {
      sequence = generateSequence(cards);
    } while (contains(sequences, sequence));
    sequences.push(sequence);
    result.push(...sequence); 
  }
  return result;
}

const contains = (sequences, current) => 
  sequences.filter(s => s.every((x, i) => x.name == current[i].name)).length;

const generateSequence = (cards) => {
  const first = cards.slice(0, 3);
  const second = cards.slice(3, 6);
  const third = cards.slice(6);
   return  [...shuffleCards(first), ...shuffleCards(second), ...shuffleCards(third)];
}

const showNextPage = (paginations, showIndex, hideIndex) => {
  paginations[hideIndex].style.display = "none";
  paginations[showIndex].style.display = "";
}

const shuffleCards = (cards) => cards.map(x => x).sort(() => Math.random() - 0.5);

const setDisabledValue = (isDisabled, ...buttons) => buttons.forEach(b => b.disabled = isDisabled);

const calculateSizes = () => {
  let n = 6;
  let offset = 8; 
  if (window.screen.width > MOBILE_MAX + 1 && window.screen.width < TABLET_MAX) {
    n = 8;
    offset = 6;
  } else if (window.screen.width < MOBILE_MAX) {
    n = 16;
    offset = 3;
  }
  return { total: n, offset: offset };
}