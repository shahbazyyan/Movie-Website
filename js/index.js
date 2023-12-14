"use strict";

import siderbar from "./sidebar.js";
import { api_key, imgBaseURL, fetchData } from "./api.js";

const pageContent = document.querySelector("[page-content]");

siderbar();

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
    banner.ariaLabel = "Popular Movies";

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

						<a href="./detail.html" class="btn">
							<img src="./assets/images/play_circle.png" alt="circle" width="24" height="24"
								arial-hidden="true">
							<span class="span">Wtach Now</span>
						</a>

					</div>
        `;

        banner.querySelector(".banner-slider").append(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlIndex}`);
        controlIndex++;
        controlItem.innerHTML = `
        <img src="${imgBaseURL}w154${poster_path}" alt="slide to ${title}" loading="lazy" draggable="false"
        class="img-cover">
        `;
        banner.querySelector(".control-inner").append(controlItem);
    };

    pageContent.append(banner);

    // addHeroSlide(banner);
};
