'use strict';

console.log('Hello World');

const form = document.getElementById('form');
form.addEventListener('submit', sendForm);

function sendForm(e) {
    e.preventDefault();

    const url = '/registration';
    const formData = serialize(form);

    const options = {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: formData.serialized
    };

    fetch(url, options)
        .catch((err) => {
            console.error('Request failed', err)
    });


    console.log(formData);
}

/*!
 * Serialize all form data into a query string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
function serialize (form) {

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

    return {
        serialized: serialized.join('&').toString(),
        response
    };
}



