'use strict';

const self = module.exports = {
    videoStream: (pathToMovie, range) => {
        const stat = FS.statSync(pathToMovie);
        const fileSize = stat.size;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);

            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;

            const chunkSize = (end - start) + 1;
            const file = FS.createReadStream(pathToMovie, {start, end});
            const httpCode = 206;
            const headers = [
                ['Content-Range', `bytes ${start}-${end}/${fileSize}`],
                ['Accept-Ranges', 'bytes'],
                ['Content-Length', chunkSize],
                ['Content-Type', 'video/mp4']
            ];

            return {file, headers, httpCode};

            // const response = h.response(file);
            // response.statusCode = 206;
            // response.header('Content-Range', `bytes ${start}-${end}/${fileSize}`);
            // response.header('Accept-Ranges', 'bytes');
            // response.header('Content-Length', chunkSize);
            // response.header('Content-Type', 'video/mp4');
            // return response;
        } else {
            const file = FS.createReadStream(pathToMovie);
            const httpCode = 206;
            const headers = [
                ['Content-Length', fileSize],
                ['Content-Type', 'video/mp4']
            ];


            return {file, headers, httpCode}
            // h.response(FS.createReadStream(pathToMovie));
            // response.statusCode = 206;
            // response.header('Content-Length', fileSize);
            // response.header('Content-Type', 'video/mp4');
            // return response;
        }
    },

    setHeaders: (response, headers) => {
        for(let header of headers) {
            response.header(header[0], header[1]);
        }

        return response;
    }
};