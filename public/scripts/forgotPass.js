'use strict';

const form = document.getElementById('form');
form.addEventListener('submit', submitForm);
const confirmPassword = document.getElementById('confirmPassword');
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
        const confirmPassword = document.getElementById('confirmPassword').value;
        const verifyCode =  document.getElementById('verifyCode').value;

        if (password !== '' &&
            verifyCode !== '' &&
            password === confirmPassword) {
            await sendForm(password, verifyCode);
        } else {
            confirmPassword.setCustomValidity("Invalid input data");
            confirmPassword.reportValidity();
        }
    } catch (err) {
        console.log(err);
    }
}

async function sendForm(password, verifyCode) {
    const url = '/reset-password';
    const formData = `password=${password}&verifyCode=${verifyCode}`;

    const options = {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: formData
    };

    return fetch(url, options);
}