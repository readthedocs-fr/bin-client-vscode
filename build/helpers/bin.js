"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBin = exports.errors = void 0;
const famfor_1 = require("@typescord/famfor");
const got_1 = require("got");
exports.errors = {
    400: 'bad request. You may have input an invalid lifetime or maximum uses. If not, please open an issue if it persists',
    403: 'forbidden. Please open an issue if it persists',
    404: 'not found. It may be stopped, or the extension may be misconfigured',
    405: 'method not allowed. Please open an issue if it persists',
    408: 'timeout. This is probably due to a small connection problem',
    413: 'payload too large. Your code is too big for the bin service which refused to process the request',
    500: 'method not allowed. Please open an issue if it persists',
    502: 'bad gateway',
    522: 'cloudflare timeout. It is highly possible that the site has crashed',
};
async function createBin({ code, filename, extension, lifetime = 0, maxUses = 0 }) {
    const fd = new famfor_1.FormData();
    if (extension) {
        fd.append('extension', extension);
    }
    fd.append('lifetime', lifetime.toString());
    fd.append('maxusage', maxUses.toString());
    fd.append('code', code, {
        filename,
        type: 'text/plain; charset=utf-8',
    });
    return got_1.default
        .post('https://bin.readthedocs.fr/new', {
        headers: fd.headers,
        body: fd.stream,
        followRedirect: false,
        timeout: 5000,
        retry: {
            limit: 2,
            methods: ['POST'],
            statusCodes: [500, 502, 503, 504, 521, 522, 524],
            errorCodes: ['ECONNRESET', 'EADDRINUSE', 'ECONNREFUSED', 'EPIPE', 'ENETUNREACH', 'EAI_AGAIN'],
        },
    })
        .then(({ headers }) => headers.location)
        .catch((error) => {
        if (error instanceof got_1.HTTPError || error instanceof got_1.TimeoutError) {
            const errorCode = error instanceof got_1.HTTPError ? error.response.statusCode : undefined;
            throw `Error ${errorCode || error.code} : ${exports.errors[errorCode !== null && errorCode !== void 0 ? errorCode : 408] || error.message}.`;
        }
        throw error.toString();
    });
}
exports.createBin = createBin;
