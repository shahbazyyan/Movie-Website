"use strict";

import { api_key, imgBaseURL, fetchData } from './api.js';
import sidebar from './sidebar.js';
import { createMovieCard } from './movie-card.js';
import searchMovies from './search.js';

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

function getGenres (genreList) {
 const newGenreList = [];
 for (const {name} of genreList) newGenreList.push(name);

 return newGenreList.join(", ");
};

const getCasts = (castList) => {
    const newCastList = [];
    for (let i = 0; i < castList.length && i < 10; i++) {
      const { name } = castList[i];
      newCastList.push(name);
    }
    return newCastList.join(", ");
};

function filterVideos (videoList) {
    return videoList.filter(({type, site}) => (type === "Trailer" || type === "Teaser" && site === "YouTube"));
};

function getDirectors (crewList) {
 const directors = crewList.filter(({job}) => job === "Director");

 const directorsList = [];
 for (const {name} of directors) directorsList.push(name);

 return directorsList.join(", ");
};

sidebar();


fetchData(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`, function (movie) {
    const {
        backdrop_path,
        poster_path,
        title,
        release_date,
        runtime,
        vote_average,
        releases: { countries: [{ certification }] },
        genres,
        overview,
        casts: {cast, crew},
        videos: { results: videos },
    } = movie;

    document.title = `${title} - DFilm`

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

movieDetail.innerHTML = `
<div class="backdrop-image" style="background-image: url(${imgBaseURL}${"w1280" || "original"}${backdrop_path || poster_path})" alt="img"></div>

<figure class="poster-box movie-poster">
    <img src="${imgBaseURL}w342${poster_path}" alt="${title}" class="img-cover">
</figure>

<div class="detail box">
    <div class="detail-content">
        <h1 class="heading">${title}</h1>
        <div class="meta-list">
            <div class="meta-item">
                <img src="./assets/images/star.png" alt="star" width="20" height="20">
                <span class="span">${vote_average.toFixed(1)}</span>
            </div>
            <div class="separator"></div>
            <div class="meta-item">${runtime}m</div>
            <div class="separator"></div>
            <div class="meta-item"> ${release_date.split("-")[0]} </div>
            <div class="meta-item card-badge">${certification}</div>
        </div>

        <p class="genre">${getGenres(genres)}</p>
        <p class="overview">${overview}</p>
        <ul class="detail-list">
            <div class="list-item">
                <p class="list-name">Starring</p>
                <p>${getCasts(cast)}</p>
            </div>
        </ul>
        <ul class="detail-list">
            <div class="list-item">
                <p class="list-name">
                    Directed By
                </p>${getDirectors(crew)}</p>
            </div>
        </ul>
    </div>

    <div class="title-wrapper">
        <h3 class="title-large">
            Trailer and Clips
        </h3>
    </div>

    <div class="slider-list">
        <div class="slider-inner">
            
        </div>
    </div>
</div>
`;

for (const {key, name} of filterVideos(videos)) {
  const videoCard = document.createElement("div");
  videoCard.classList.add("video-card");

  videoCard.innerHTML = `
    <iframe width="500" height="290" src="https://www.youtube.com/embed/${key}?theme=dark&color=white&rel=0" frameboarder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"> </iframe>
  `;

  movieDetail.querySelector(".slider-inner").append(videoCard);
};

pageContent.append(movieDetail);

fetchData(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`, 
addSuggetionsMovies
);


function addSuggetionsMovies ({results: movieList}, title) {
    const movieElem = document.createElement("section");
    movieElem.classList.add("movie-list");
    movieElem.ariaLabel = 'You may also like this';
   
    movieElem.innerHTML = `
    
			<div class="title-wrapper">
            <h3 class="title-large">You may also like this</h3>
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

});

searchMovies();

