'use strict';

const FS = require('fs');
const {promisify: Promisify} = require('util');
const writeFileAsync = Promisify(FS.writeFile);




const self = module.exports = {
    handleFileUpload: async (path, data) => {
        return writeFileAsync(path, data)
    }
};