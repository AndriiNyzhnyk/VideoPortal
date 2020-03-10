'use strict';

window.onload = function () {

    const buttonAddMovieToFavourites = document.getElementById('addMovieToFavourites');
    buttonAddMovieToFavourites.addEventListener('click', addNewMovieToFavourites);

    /**
     * Add new movie to favourites
     */
    function addNewMovieToFavourites() {
        const currentMovieId = document.getElementById('movieId').textContent;
        const currentImageSrc = document.getElementById('imgFilm').firstElementChild.currentSrc;
        const currentMovieNameEn = document.getElementById('filmName').lastElementChild.textContent;
        const currentMovieNameUa = document.getElementById('filmName').firstElementChild.textContent;
        const listFavouriteMovies = document.getElementById('listFavouriteMovies');

        const allOldValues = JSON.parse(window.localStorage.getItem('FavouriteMovies')) || [];
        const sameMovie = allOldValues.find((movie) => movie['movieId'] === currentMovieId);

        if (!sameMovie) {
            const data = {
                movieId: currentMovieId,
                imageSrc: currentImageSrc,
                nameEn: currentMovieNameEn,
                nameUa: currentMovieNameUa
            };

            allOldValues.push(data);

            window.localStorage.setItem('FavouriteMovies', JSON.stringify(allOldValues));

            const viewMovie = createFavouriteMovie(data);
            listFavouriteMovies.append(viewMovie);
        }
    }

    /**
     * Create HTML markup using js
     * @param {Object} movie
     */
    function createFavouriteMovie(movie) {
        // <div class="itemFavouriteMovies">
        //     <img src="" alt="" class="imageFavouriteMovies">
        //     <div class="nameFavouriteMovies"></div>
        //     <div class="nameFavouriteMovies"></div>
        // </div>

        let father = document.createElement('div');
        father.className = 'itemFavouriteMovies';
        father.id = `favourite_movie_${movie.movieId}`;


        let image = document.createElement('img');
        image.src = movie.imageSrc;
        image.className = 'imageFavouriteMovies';
        father.append(image);


        let nameEn = document.createElement('div');
        nameEn.className = 'nameFavouriteMovies';

        let textEn = document.createTextNode(movie.nameEn);
        nameEn.append(textEn);
        father.append(nameEn);


        let nameUa = document.createElement('div');
        nameUa.className = 'nameFavouriteMovies';


        let textUa = document.createTextNode(movie.nameUa);
        nameUa.append(textUa);
        father.append(nameUa);

        return father;
    }

    /**
     * Render old favourites movies
     */
    function renderFavouritesMovies() {
        const allFavouriteMovies = JSON.parse(window.localStorage.getItem('FavouriteMovies')) || [];
        const listFavouriteMovies = document.getElementById('listFavouriteMovies');

        for (let movie of allFavouriteMovies) {
            const viewMovie = createFavouriteMovie(movie);
            viewMovie.addEventListener('click', onClickFavouriteMovie);
            listFavouriteMovies.append(viewMovie);
        }
    }
    renderFavouritesMovies();

    /**
     * Redirect on favourite movie page
     * @param e
     */
    function onClickFavouriteMovie(e) {
        const parentElement = e.target.parentElement;
        const movieId = parentElement.id.split('_')[2];

        window.location.replace(`${window.location.origin}/movie/page/${movieId}`);
    }


    const form = document.getElementById('newCommentForm');
    form.addEventListener('submit', submitForm);

    /**
     * Submit HTML Form
     * @param e
     * @returns {Promise<void>}
     */
    async function submitForm(e) {
        try {
            e.preventDefault();

            const movieId = document.getElementById('movieId').value;
            const comment = document.getElementById('comment').value;
            // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNDJhNWVjYmNkZDRhZWVjNmVjZTE4NDA0Y2IxZDcxMmQiLCJ1c2VySWQiOiIyMGZlNjg4MmM5OTA3OTY4YTFlMDcyYmI4ZTQ0MmI4MzoxNjRiYWI5YzJmNGYwZGYxN2ViOWIyYTAxNDg2ZDNkMWUxZjMxNGNmNzkzNjY2ZDA0MDY4ZDRmMWVmNzVkOTZlIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTU4Mjc0MzA4OCwiZXhwIjoxNTgyNzQ2Njg4fQ.8mdKkVZZ4_G96E2fB6UF_ZaDQ7qv_Cm_e1MgZFbXxuI';
            const token = getAccessToken();

            if (movieId === '' || comment === '') {
                alert("Wrong comment");
            }

            const response = await sendForm(movieId, comment, token);

            if (response.status === 401) {
                const redirectSignIn = confirm("Щоб додати коментар потрібно увійти у систему! Здійснити перехід на сторінку входу");

                if (redirectSignIn) {
                    rememberCurrentPage();
                    window.location.replace(`${window.location.origin}/sign-in`);
                }
            }

            // Read response (comment) and then render new comment on the movie page
            const body = await response.json();
            renderNewComment(body);

            form.reset();
        } catch (err) {
            console.error(err);
        }
    }

    function sendForm(movieId, comment, token) {
        const url = '/comment';
        const queryString = `movieId=${movieId}&comment=${comment}`;

        const options = {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Authorization": token // 'Bearer ' + token
            },
            body: queryString
        };

        return fetch(url, options);
    }

    /**
     * Get access token from localStorage
     * @returns {string}
     */
    function getAccessToken() {
        return window.localStorage.getItem('accessToken');
    }

    /**
     * Add current page to localStorage
     */
    function rememberCurrentPage() {
        window.localStorage.setItem('moviePage', window.location.href);
    }

    /**
     * Create HTML markup using js
     * @param {Object} comment
     */
    function renderNewComment(comment) {
        // Example
        // <div class="comment" id="content_{{this._id}}">
        //     <div class="comment__header"><span>Posted: {{this.posted}}</span></div>
        //     <div class="comment__text">{{this.text}}</div>
        // </div>

        const comments = document.getElementById('comments');

        let father = document.createElement('div');
        father.className = 'comment';
        father.id = `comment_${comment._id}`;


        let child1 = document.createElement('div');
        child1.className = 'comment__header';

        let span = document.createElement('span');
        const posted = document.createTextNode(`Posted: ${comment.posted}`);
        span.append(posted);
        child1.append(span);


        let child2 = document.createElement('div');
        child2.className = 'comment__text';
        const commentText = document.createTextNode(comment.text);
        child2.append(commentText);

        father.append(child1);
        father.append(child2);

        comments.append(father);
    }
};