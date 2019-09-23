'use strict';

const form = document.getElementById('form');
form.addEventListener('submit', submitForm);
const confirmPassword = document.getElementById('confirmPass');
confirmPassword.addEventListener('input', realTimeValidation);
confirmPassword.addEventListener('change', realTimeValidation);

function realTimeValidation(e) {
    const confirmPass = e.target.value;
    const password = document.getElementById('password').value;

    if (confirmPass === '' || (confirmPass !== '' && password === confirmPass)) {
        e.target.style.border = '1px solid #FFFFFF';
    } else {
        e.target.style.border = '2px solid #E34234';
    }
}

async function submitForm(e) {
    try {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPass').value;

        if (password !== '' &&
            password === confirmPassword) {
            await sendForm(password);
        } else {
            confirmPassword.setCustomValidity("Invalid input data");
            confirmPassword.reportValidity();
        }
    } catch (err) {
        console.log(err);
    }
}

async function sendForm(password) {
    const url = '/forgot-password';
    const formData = `password=${password}`;

    const options = {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: formData
    };

    return fetch(url, options);
}