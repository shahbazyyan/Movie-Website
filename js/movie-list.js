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

fetchData(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${paramsURL}`, function ({results: movieList, total_pages}) {

totalPages = total_pages;

document.title = `${genreName} Movies - DFILM`;
const moviListElem = document.createElement("section");
moviListElem.classList.add("movie-list")

});