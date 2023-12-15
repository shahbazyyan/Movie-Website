"use strict";

import siderbar from "./sidebar.js";
import { api_key, imgBaseURL, fetchData } from "./api.js";
import { createMovieCard } from './movie-card.js';
import searchMovies from "./search.js";

const pageContent = document.querySelector("[page-content]");

siderbar();

// HOME PAGE Movies

const homePageMovies = [
    {
        title: "Upcoming Movies",
        path: "/movie/upcoming"
    },
    {
        title: "Weakly Treading Movies",
        path: "/trending/movie/week"
    },
    {
        title: "Top Rated Movies",
        path: "/movie/top_rated"
    },
]


const genreList = {
    asString(genreIdList) {
        let newGenreList = [];

        for (const genreId of genreIdList) {
            this[genreId] && newGenreList.push(this[genreId]);
        };

        return newGenreList.join(", ")
    }
};

fetchData(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
    for (const { id, name } of genres) {
        genreList[id] = name;
    };

    fetchData(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
});

function heroBanner({ results: movieList }) {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.setAttribute("aria-label", "Popular Movies");

    banner.innerHTML = `
        <div class="banner-slider"> </div>
        <div class="slider-control">
            <div class="control-inner"></div>
        </div>
    `;

    let controlIndex = 0;
    for (const [index, movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
        } = movie;

        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item", "");

        sliderItem.innerHTML = `
            <img src="${imgBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading="${index === 0 ? "eager" : "lazy"}">
            <div class="banner-content">
                <h2 class="heading">${title}</h2>
                <div class="meta-list">
                    <div class="meta-item">${release_date.split("-")[0]}</div>
                    <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
                </div>
                <p class="genre">${genreList.asString(genre_ids)}</p>
                <p class="banner-text">${overview}</p>
                <a href="./detail.html" class="btn" onclick='getMovieDetails("${id}")'>
                    <img src="./assets/images/play_circle.png" alt="circle" width="24" height="24" aria-hidden="true">
                    <span class="span">Watch Now</span>
                </a>
            </div>
        `;

        banner.querySelector(".banner-slider").append(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlIndex}`);
        controlIndex++;
        controlItem.innerHTML = `
            <img src="${imgBaseURL}w154${poster_path}" alt="slide to ${title}" loading="lazy" draggable="false" class="img-cover">
        `;
        banner.querySelector(".control-inner").append(controlItem);
    }

    pageContent.append(banner);

    addHeroSlide();

    // upcoming movies

    for (const {title, path} of homePageMovies ) {
        fetchData(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
    }


};

function addHeroSlide() {
    const sliderItem = document.querySelectorAll("[slider-item]");
    const sliderControl = document.querySelectorAll("[slider-control]");

    let lastSlide = sliderItem[0];
    let lastControl = sliderControl[0];

    lastSlide.classList.add("active");
    lastControl.classList.add("active");

    function sliderStart() {
        lastSlide.classList.remove("active");
        lastControl.classList.remove("active");

        lastSlide = sliderItem[Number(this.getAttribute("slider-control"))];
        lastControl = this;

        lastSlide.classList.add("active");
        lastControl.classList.add("active");
    }

    sliderControl.forEach(control => {
        control.addEventListener("click", sliderStart);
    });
};


function createMovieList ({results: movieList}, title) {
    const movieElem = document.createElement("section");
    movieElem.classList.add("movie-list");
    movieElem.ariaLabel = `${title}`;

    movieElem.innerHTML = `
    
			<div class="title-wrapper">
            <h3 class="title-large">${title}</h3>
        </div>

        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    `;


    for (const movie of movieList) {
        const movieCard = createMovieCard(movie);
        movieElem.querySelector(".slider-inner").append(movieCard);
    };



    pageContent.append(movieElem);
};

searchMovies();
