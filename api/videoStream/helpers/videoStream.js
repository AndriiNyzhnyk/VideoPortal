'use strict';

const FS = require('fs');
const {promisify: Promisify} = require('util');
const statAsync = Promisify(FS.stat);

const self = module.exports = {
    videoStream: async (pathToMovie, range) => {
        const stat = await statAsync(pathToMovie);
        const fileSize = stat.size;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);

            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;

            const chunkSize = (end - start) + 1;
            const file = FS.createReadStream(pathToMovie, {start, end});
            const data = {
                start,
                end,
                chunkSize,
                fileSize
            };

            return {file, isRange: true, data};
        } else {
            const file = FS.createReadStream(pathToMovie);
            const data = {fileSize};

            return {file, isRange: false, data};
        }
    },

    setHeaders: (response, headers) => {
        for(let header of headers) {
            response.header(header[0], header[1]);
        }

        return response;
    }
};