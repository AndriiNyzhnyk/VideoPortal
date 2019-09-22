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

async function sendForm(email) {
    try {
        const url = '/forgot-pass';
        const formData = `email=${email}`;

        const options = {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: formData
        };

        const response = await fetch(url, options);

    } catch (err) {
        console.error(err);
    }
}