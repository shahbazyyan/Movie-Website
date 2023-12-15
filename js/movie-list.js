"use-strict";

import { api_key, fetchData } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import sidebar from './sidebar.js';

const pageContent = document.querySelector("[page-content]");
const genreName = window.localStorage.getItem("genreName");
const paramsURL = window.localStorage.getItem("paramsURL");

sidebar();

let currentPage = 1;
let totalPages = 0;

fetchData(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${paramsURL}`, function ({ results: movieList, total_pages }) {

    totalPages = total_pages;

    document.title = `${genreName} Movies - DFILM`;
    const moviListElem = document.createElement("section");
    moviListElem.classList.add("movie-list", "genre-list");
    moviListElem.ariaLabel = `${genreName} Movies`;

    moviListElem.innerHTML = `
<div class="title-wrapper">
<h1 class="heading">All ${genreName} movies</h1>
</div>

<div class="grid-list"></div>

<button class="btn load-more" load-more>Load More</button>
`;

for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    moviListElem.querySelector(".grid-list").append(movieCard);
};

pageContent.append(moviListElem);

document.querySelector("[load-more]").addEventListener("click", function () {
  if(currentPage >= totalPages) {
    this.style.display = "none";
    return;
  };

  currentPage++;
  this.classList.add("loading");

  fetchData(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${paramsURL}`, ({results: movieList}) => {
     this.classList.remove("loading");

     for (const movie of movieList) {
        const movieCard = createMovieCard(movie);

        moviListElem.querySelector(".grid-list").append(movieCard);
     }
  });
});


});