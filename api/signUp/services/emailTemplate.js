'use strict';

const Handlebars = require('handlebars');

const self = module.exports = {
    init: async (data) => {
        try {
            const source = await self.createTemplate();
            const template = Handlebars.compile(source);

            return await self.addDataToTemplate(template, data);
        } catch (e) {
            console.log(e);
        }
    },

    createTemplate: () => {
        return new Promise((resolve) => {
            let source = "<p>To activate your account please follow the <a href={{link}}>link</a></p>";

            resolve(source);
        });
    },

    addDataToTemplate: (template, data) => {
        return new Promise((resolve) => {

            // JSON data
            resolve(template(data));
        });
    }
};