"use strict";

import {setCardsToContainer} from "./card.js";
import { getCards } from "./json_reader.js";

const LEFT_BUTTON = document.querySelector(".pets-slider-left");
const RIGHT_BUTTON = document.querySelector(".pets-slider-right");
const CAROUSEL = document.querySelector(".carousel");
const CURRENT_PETS = document.querySelector(".current-cards");
const LEFT_PETS = document.querySelector(".left-cards");
const RIGHT_PETS = document.querySelector(".right-cards");

const shuffleCards = (cards) => cards.map(x => x).sort(() => Math.random() - 0.5).slice(0, 3);

const getRandomizedCards = (cards, previousCards) => {
  if (!previousCards) {
    return shuffleCards(cards);
  }
  const filtered = cards.filter(card => !previousCards.includes(card));
  return shuffleCards(filtered);
}

const init = (json, itemsCount) => {
  const current = shuffleCards(json);
  const leftCards = getRandomizedCards(json, current);
  const rightCards = getRandomizedCards(json, current);
  setCardsToContainer(CURRENT_PETS, current, itemsCount);
  setCardsToContainer(LEFT_PETS, leftCards, itemsCount);
  setCardsToContainer(RIGHT_PETS, rightCards, itemsCount);
  return { current: current, leftCards: leftCards, rightCards: rightCards };
}

const moveLeft = () => {
  CAROUSEL.classList.add("animation-left");
  LEFT_BUTTON.removeEventListener("click", moveLeft);
  RIGHT_BUTTON.removeEventListener("click", moveRight);
}

const moveRight = () => {
  CAROUSEL.classList.add("animation-right");
  LEFT_BUTTON.removeEventListener("click", moveLeft);
  RIGHT_BUTTON.removeEventListener("click", moveRight);
}

LEFT_BUTTON.addEventListener("click", moveLeft);
RIGHT_BUTTON.addEventListener("click", moveRight);

const updateContainersToLeft = (json, allCards, itemsCount) => {
  const newRightCards = allCards.current;
  const newCurrent = allCards.leftCards;
  const newLeftCards = getRandomizedCards(json, newCurrent);
  setCardsToContainer(RIGHT_PETS, newRightCards, itemsCount);
  setCardsToContainer(CURRENT_PETS, newCurrent, itemsCount);
  setCardsToContainer(LEFT_PETS, newLeftCards, itemsCount);
  return { current: newCurrent, leftCards: newLeftCards, rightCards: newRightCards };
}

const updateContainersToRight = (json, allCards, itemsCount) => {
  const newLeftCards = allCards.current;
  const newCurrent = allCards.rightCards;
  const newRightCards = getRandomizedCards(json, newCurrent);
  setCardsToContainer(LEFT_PETS, newLeftCards, itemsCount);
  setCardsToContainer(CURRENT_PETS, newCurrent, itemsCount);
  setCardsToContainer(RIGHT_PETS, newRightCards, itemsCount);
  return { current: newCurrent, leftCards: newLeftCards, rightCards: newRightCards };
}

const rebuild = (allCards, itemsCount) => {
  setCardsToContainer(CURRENT_PETS, allCards.current, itemsCount);
  setCardsToContainer(LEFT_PETS, allCards.leftCards, itemsCount);
  setCardsToContainer(RIGHT_PETS, allCards.rightCards, itemsCount);
}

getCards().then((json) => {
    let itemsCount = calculateCount(window.screen.width);
    let allCards = init(json, itemsCount);
    const tableMedia = window.matchMedia(`(max-width: 1270px)`);
    const mobileMedia = window.matchMedia(`(max-width: 605px)`);
    const desktopMedia = window.matchMedia(`(min-width: 1271px)`);
    tableMedia.addEventListener("change", function() {
      itemsCount = calculateCount(window.screen.width);
      rebuild(allCards, itemsCount);
    });
    mobileMedia.addEventListener("change", function() {
      itemsCount = calculateCount(window.screen.width);
      rebuild(allCards, itemsCount);
    });
    desktopMedia.addEventListener("change", function() {
      itemsCount = calculateCount(window.screen.width);
      rebuild(allCards, itemsCount);
    });
    CAROUSEL.addEventListener("animationend", function() {
      if (this.classList.contains("animation-left")) {
        allCards = updateContainersToLeft(json, allCards, itemsCount);
      } else {
        allCards = updateContainersToRight(json, allCards, itemsCount);
      }
      CAROUSEL.classList.remove("animation-left", "animation-right");
      LEFT_BUTTON.addEventListener("click", moveLeft);
      RIGHT_BUTTON.addEventListener("click", moveRight);
    });
  });

function calculateCount(width) {
  if (width < 605) {
    return 1;
  }
  if (width <= 1270) {
    return 2;
  }
  return 3;
}