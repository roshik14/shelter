"use strict";

const burgerMenuIcon = document.querySelector(".burger-menu");
const menu = document.querySelector(".header-list");
const intro = document.querySelector(".intro-background");

const hideMenu = () => {
  burgerMenuIcon.classList.remove("burger-menu-active");
  document.body.classList.remove("disable-scrolling");
  if (!intro) {
    Array.from(menu.children).map(li => li.firstElementChild)
      .forEach(elem => elem.classList.add("pets-nav-link"));
    burgerMenuIcon.classList.remove("pets-burger-menu-active");
  }
  menu.classList.remove("header-list-active");
}

const toggleMenu = () => {
  burgerMenuIcon.classList.toggle("burger-menu-active");
  document.body.classList.toggle("disable-scrolling");
  if (!intro) {
    Array.from(menu.children).map(li => li.firstElementChild)
      .forEach(elem => elem.classList.remove("pets-nav-link"));
    burgerMenuIcon.classList.toggle("pets-burger-menu-active");
  }
  menu.classList.toggle("header-list-active");
}

burgerMenuIcon.addEventListener("click", toggleMenu);

menu.addEventListener("click", (event) => {
  if (event.target.tagName == "LI" || event.target.tagName == "A") {
    hideMenu();
  }
});

const tableMedia = window.matchMedia("(max-width: 768px)");
const dekstopMedia = window.matchMedia("(min-width: 769px)");
tableMedia.addEventListener("change", function() {
  hideMenu();
});

dekstopMedia.addEventListener("change", function() {
  hideMenu();
});
