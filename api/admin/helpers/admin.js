'use strict';

const FS = require('fs');

const self = module.exports = {
    handleStreamFileUpload: (path, data) => {
        return new Promise((resolve, reject) => {
            const writeableStream = FS.createWriteStream(path);
            data.pipe(writeableStream);

            writeableStream.on('finish', resolve);
            writeableStream.on('error', reject);
        });
    }
};