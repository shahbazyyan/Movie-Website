"use strict";

import { api_key, fetchData } from "./api.js";

function siderbar() {
    const genreList = {};

    fetchData(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
        for (const { id, name } of genres) {
            genreList[id] = name;
        };

        genreLink();
    });

    const siderbarInner = document.createElement("div");
    siderbarInner.classList.add("sidebar-inner");

    siderbarInner.innerHTML = `
    <div class="sidebar-list">
				<p class="title">Genre</p>
			</div>

			<div class="sidebar-list">
				<p class="title">Language</p>
				<a href="./movie-list.html" menu-close class="sidebar-link">English</a>

				<a href="./movie-list.html" menu-close class="sidebar-link">Hindi</a>

				<a href="./movie-list.html" menu-close class="sidebar-link">Bengali</a>

				<a href="./movie-list.html" menu-close class="sidebar-link">Russian</a>

			</div>

			<div class="sidebar-footer">
				<p class="copyright">Copyright 2024 by David </p>
				<img src="./assets/images/tmdb-logo.svg" alt="movie db logo" width="130" height="17">
			</div>
    `;

    const genreLink = function () {
        for (const [genreId, genreName] of Object.entries(genreList)) {
            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "./movie-lisy.html");
            link.setAttribute("menu-close", "");
            // link.setAttribute("onClick", `getMoviesList("with_genres=${genreId}", "${genreName}")`)
            link.textContent = genreName;

            siderbarInner.querySelectorAll(".sidebar-list")[0]
             .append(link);
        }

        const sidebar = document.querySelector("[sidebar]");
        sidebar.append(siderbarInner);
        toggleSidebar(sidebar)
    };

    function toggleSidebar (sidebar) {
        const sidebarBtn = document.querySelector("[menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
        const sidebarClose = document.querySelectorAll("[menu-close]");
        const overlay = document.querySelector("[overlay]");

        addEvents(sidebarTogglers, "click", function () {
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        addEvents(sidebarClose, "click", function () {
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");
        })
    }

};

export default siderbar