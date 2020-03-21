'use strict';

/**
 * Logic related to search movie
 */
const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");

searchIcon.addEventListener("click", (e) => {
    const searchText = searchInput.value;

    if (searchText) {
        window.location.href = `/movie/search/${searchInput.value}`;
    }
});

// Execute a function when the user releases a key on the keyboard
searchInput.addEventListener("keyup", (e) => {
    // Number 13 is the "Enter" key on the keyboard
    if (e.keyCode === 13) {

        // Trigger the button element with a click
        searchIcon.click();
    }
});