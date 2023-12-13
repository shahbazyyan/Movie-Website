"use strict";

const api_key = "dbf1663d349c5e02a4908212e77363a0";
const imgBaseURL = "https://image.tmdb.org/t/p/";


const fetchData = function (url,callback, optionalParam) {
    fetch(url)
    .then(res => res.json())
    .then(res => callback(res, optionalParam))
    .catch(err => console.log(err))
};


export {imgBaseURL, api_key, fetchData}