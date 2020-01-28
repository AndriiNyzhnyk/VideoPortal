'use strict';

const form = document.getElementById('form');
form.addEventListener('submit', submitForm);


const confirmPassword = document.getElementById('confirmPassword');
confirmPassword.addEventListener('input', realTimeValidation);
confirmPassword.addEventListener('change', realTimeValidation);

function realTimeValidation(e) {
    const confirmPass = e.target.value;
    const password = document.getElementById('password');

    if (confirmPass === '' || (confirmPass !== '' && password.value === confirmPass)) {
        e.target.style.border = '1px solid #FFFFFF';
    } else {
        e.target.style.border = '2px solid #E34234';
    }
}

async function submitForm(e) {
    try {
        e.preventDefault();

        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        if (password.value !== '' && confirmPassword.value !== '' && (password.value === confirmPassword.value)) {
            const { serialized } = await serialize(form);
            const response = await sendForm(serialized);

            if (response.status >= 200 && response.status < 300) {
                alert('Please check your email!');
            } else {
                alert('Something went wrong please try again later');
            }

            form.reset();

        } else {
            // alert('Passwords Don\'t Match');
            confirmPassword.setCustomValidity("Passwords Don't Match");
            confirmPassword.reportValidity();
        }
    } catch (err) {
        console.error(err);
    }
}

function sendForm(formData) {
    const url = '/registration';

    const options = {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: formData
    };

    return fetch(url, options);
}

/**
 * Serialize all form data into a query string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {Object}      The object with form data and data into object
 */
function serialize (form) {
    return new Promise((resolve) => {
        // Setup our serialized data
        let serialized = [];
        let response = Object.create(null);

        // Loop through each field in the form
        for (let i = 0; i < form.elements.length; ++i) {
            let field = form.elements[i];

            // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
            if (!field.name ||
                field.disabled ||
                field.type === 'file' ||
                field.type === 'reset' ||
                field.type === 'submit' ||
                field.type === 'button') {
                continue;
            }

            // If a multi-select, get all selections
            if (field.type === 'select-multiple') {
                for (let n = 0; n < field.options.length; ++n) {
                    if (!field.options[n].selected) continue;
                    serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
                    response[encodeURIComponent(field.name).toString()] = encodeURIComponent(field.options[n].value);
                }
            }

            // Convert field data to a query string
            else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                response[encodeURIComponent(field.name).toString()] = encodeURIComponent(field.value);
            }
        }

        resolve({
            serialized: serialized.join('&').toString(),
            response
        });
    });
}