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
        console.log(token);

        if (movieId === '' || comment === '') {
            alert("Wrong comment");
        }

        const response = await sendForm(movieId, comment, token);
        // const body = await response.json();

       if (response.status === 401) {
           const redirectSignIn = confirm("Щоб додати коментар потрібно увійти у систему! Здійснити перехід на сторінку входу");

           if (redirectSignIn) {
               window.location.replace(`${window.location.origin}/sign-in`);
           }
       }

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