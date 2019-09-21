'use strict';

const form = document.getElementById('form');
form.addEventListener('submit', submitForm);

async function submitForm(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;

    if (email !== '') {
        const response = await sendForm(email);
        alert('Please check your email');

    } else {
        confirmPassword.setCustomValidity("Invalid input data");
        confirmPassword.reportValidity();
    }
}

function sendForm(email) {
    const url = '/init-forgot-password';
    const formData = `email=${email}`;

    const options = {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: formData
    };

    fetch(url, options)
        .catch((err) => {
            console.error('Request failed', err)
        });
}