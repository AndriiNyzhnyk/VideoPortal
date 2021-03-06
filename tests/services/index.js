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
            genres: [chance.word(), chance.word(), chance.word()],
            artists: [chance.word(), chance.word(), chance.word()],
            producer: chance.name(),
            duration: chance.integer({ min: 15, max: 1000 }),
            age: chance.integer({ min: 8, max: 100 }),
            firstRun: new Date(chance.date()).toISOString(),
            description: chance.paragraph()
        };
    },

    createFakeUserCredentials: () => {
        const password = self.generatePassword();

        return {
            userName: chance.name(),
            email: chance.email(),
            password
        };
    },

    generatePassword: () => {
        return chance.string({ length: 8, casing: 'lower', alpha: true, numeric: true, symbols: true}) +
            chance.character({ alpha: true }) +
            chance.character({ numeric: true }) +
            chance.character({ casing: 'lower' }) +
            chance.character({ casing: 'upper' }) +
            chance.character({ symbols: true });
    },

    createSignUpRequestOptions: (user) => {
        return  {
            method: 'POST',
            url: '/registration',
            payload: JSON.stringify(user)
        };
    },

    createSignInRequestOptions: (credentials) => {
        return  {
            method: 'POST',
            url: '/login',
            payload: JSON.stringify(credentials)
        };
    },

    createTestTokenRequestOptions: (accessToken = '') => {
        return  {
            method: 'GET',
            url: '/token-test',
            headers: {
                Authorization: accessToken
            }
        };
    },

    createActivateUserRequestOptions: (activateCode) => {
        return  {
            method: 'GET',
            url: `/activate-user/${activateCode}`
        };
    },

    createForgotPasswordRequestOptions: (email) => {
        return {
            method: 'POST',
            url: '/forgot-pass',
            payload: JSON.stringify({email})
        }
    },

    createResetPasswordRequestOptions: (password, verifyCode) => {
        return {
            method: 'POST',
            url: '/reset-password',
            payload: JSON.stringify({password, verifyCode})
        }
    }
};