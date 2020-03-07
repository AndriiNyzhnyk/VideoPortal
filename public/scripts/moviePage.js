'use strict';

const form = document.getElementById('newCommentForm');
form.addEventListener('submit', submitForm);

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

function getAccessToken() {
    return window.localStorage.getItem('accessToken');
}

function rememberCurrentPage() {
    window.localStorage.setItem('moviePage', window.location.href);
}

function renderNewComment(comment) {
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

const buttonAddMovieToFavourites = document.getElementById('addMovieToFavourites');
buttonAddMovieToFavourites.addEventListener('click', addNewMovieToFavourites);

function addNewMovieToFavourites() {
    const currentMovie = document.getElementById('movieId').textContent;
    const allOldValues = JSON.parse(window.localStorage.getItem('FavouriteMovies')) || [];
    const sameMovie = allOldValues.find((movie) => movie === currentMovie);

    if (!sameMovie) {
        allOldValues.push(currentMovie);

        window.localStorage.setItem('FavouriteMovies', JSON.stringify(allOldValues));
    }
}