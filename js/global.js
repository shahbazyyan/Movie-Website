"use strict";

function addEvents(elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
}

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEvents(searchTogglers, "click", function () {
    searchBox.classList.toggle("active");
});

const getMovieDetails = function (movieId) {
 window.localStorage.setItem("movieId", String(movieId));
}; 

const getMovieList = function(paramsURL, genreName) {
  window.localStorage.setItem("paramsURL", paramsURL);
  window.localStorage.setItem("genreName", genreName);
}

