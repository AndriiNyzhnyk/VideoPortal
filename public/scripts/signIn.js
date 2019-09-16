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

function sendForm(data) {
    const url = '/login';
    const queryString = `userName=${data.userName}&Password=${data.password}`;

    const options = {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: queryString
    };

    fetch(url, options)
        .catch((err) => {
            console.error('Request failed', err)
        });
}