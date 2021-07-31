import FormData from 'form-data';
import got, { HTTPError, TimeoutError } from 'got';

export const errors: Record<number, string> = {
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

interface BinOptions {
	code: string;
	fileName: string;
	language?: string;
	lifeTime?: number;
	maxUses?: number;
}

export async function createBin({ code, fileName, lifeTime = 0, maxUses = 0 }: BinOptions): Promise<string> {
	const fd = new FormData();

	fd.append('lifetime', lifeTime.toString());
	fd.append('maxusage', maxUses.toString());
	fd.append(fileName, code, {
		filename: fileName,
		contentType: 'text/plain; charset=utf-8',
	});

	return got
		.post('https://bin.readthedocs.fr/new', {
			body: fd,
			followRedirect: false,
			timeout: 5000,
			retry: {
				limit: 2,
				methods: ['POST'],
				statusCodes: [500, 502, 503, 504, 521, 522, 524],
				errorCodes: ['ECONNRESET', 'EADDRINUSE', 'ECONNREFUSED', 'EPIPE', 'ENETUNREACH', 'EAI_AGAIN'],
			},
		})
		.then(({ headers }) => headers.location!) // the server always returns the Location header
		.catch((error: Error) => {
			if (error instanceof HTTPError || error instanceof TimeoutError) {
				const errorCode = error instanceof HTTPError ? error.response.statusCode : undefined;
				throw `Error ${errorCode || error.code} : ${errors[errorCode ?? 408] || error.message}.`;
			}
			throw error.toString();
		});
}
