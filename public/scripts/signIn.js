'use strict';

const form = document.getElementById('form');
form.addEventListener('submit', submitForm);

async function submitForm(e) {
    try {
        e.preventDefault();

        const userName = document.getElementById('uname').value;
        const password = document.getElementById('psw').value;

        if (userName !== '' && password !== '') {
            const response = await sendForm({userName, password});
            const body = await response.json();

            if (response.status === 200) {

                await addTokenToStorage(body);

                if (response.redirected) {
                    window.location.replace(response.url)
                }

                // Get previous movie page
                const previousPage = getPreviousPage();

                if (previousPage) {
                    removeLocaleStorageItem('moviePage');

                    window.location.replace(previousPage);
                } else {
                    window.location.replace(window.location.origin);
                }
            }

            alert('Wrong credentials');
            form.reset();
        } else {
            alert('Please input all field');
        }
    } catch (err) {
        console.error(err);
    }
}

async function sendForm(data) {
    const url = '/login';
    const queryString = `userName=${data.userName}&password=${data.password}`;

    const options = {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: queryString
    };

    return fetch(url, options);
}

async function addTokenToStorage(data) {
    for (let key in data) {
        window.localStorage.setItem(key, data[key]);
    }
}

function getPreviousPage() {
    return window.localStorage.getItem('moviePage');
}

function removeLocaleStorageItem(key) {
    window.localStorage.removeItem(key);
}