'use strict';

const form = document.getElementById('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    const userName = document.getElementById('uname').value;
    const password = document.getElementById('psw').value;

    if (userName !== '' && password !== '') {
        sendForm({userName, password});
    } else {
        alert('Please input all field');
    }
}

async function sendForm(data) {
    try {
        const url = '/login';
        const queryString = `userName=${data.userName}&password=${data.password}`;

        const options = {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: queryString
        };

        const response = await fetch(url, options);

        if (response.redirected) {
            window.location.replace(response.url)
        }
    } catch (err) {
        console.error('Request failed', err)
    }
}