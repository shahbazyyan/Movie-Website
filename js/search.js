"use strict";

import { api_key, fetchData  } from "./api.js";
import { createMovieCard } from "./movie-card.js";


function searchMovies () {

    const searchWrapper = document.querySelector("[search-wrapper]");
    const searchField = document.querySelector("[search-field]");

    const searchResultModal = document.createElement("div");

    searchResultModal.classList.add("search-modal");
    document.querySelector("main").append(searchResultModal);
    let searchTimeOut;

    searchField.addEventListener("input", function () {
        if(!searchField.value.trim()) {
            searchResultModal.classList.remove("active");
            searchWrapper.classList.remove("searching");
            clearTimeout(searchTimeOut);
            return;
        };

        // searchWrapper.classList.add("searching");
        clearTimeout(searchTimeOut);

        searchTimeOut = setTimeout(function () {
           fetchData(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page1&include_adult=false`
           , function ({results: movieList}) {
                searchWrapper.classList.remove("searching");
                searchResultModal.classList.add("active");
                searchResultModal.innerHTML = "";
                searchResultModal.innerHTML = `
                <p class="label">Results for</p>

            <h1 class="heading">${searchField.value}</h1>
            <div class="movie-list">
                <div class="grid-list"></div>
            </div>
                `; 

                for (const movie of movieList) {
                    const movieCard = createMovieCard(movie);

                    searchResultModal.querySelector(".grid-list").append(movieCard);
                }
           });
        }, 500);

    });

};

export default searchMovies;