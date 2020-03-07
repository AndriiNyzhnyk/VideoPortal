'use strict';

const Chance = require('chance');

const chance = new Chance();

const self = module.exports = {

    getAuthRequestOptions: () => {
        const credentials = {
            userName: 'TestUser125478',
            password: 'TempPass123!'
        };

        return {
            method: 'POST',
            url: '/login',
            payload: JSON.stringify(credentials)
        };
    },


    createFakeDataForMovie: () => {
        return {
            nameUa: chance.word(),
            nameEn: chance.word(),
            sourceImg: `/${chance.word()}/${chance.word()}.jpg`,
            sourceVideo: `/${chance.word()}/${chance.word()}.mp4`,
            qualityVideo: chance.integer({min: 144, max: 4320}),
            translation: chance.word(),
            motto: chance.word(),
            year: Number.parseInt(chance.year({min: 2000, max: 2100})),
            country: chance.word(),
            genre: [chance.word(), chance.word(), chance.word()],
            producer: chance.name(),
            duration: chance.integer({ min: 15, max: 1000 }),
            age: chance.integer({ min: 8, max: 100 }),
            firstRun: new Date(chance.date()).toISOString(),
            artists: `${chance.name()}, ${chance.name()}, ${chance.name()}, ${chance.name()}, ${chance.name()}`,
            description: chance.paragraph()
        };
    }
};