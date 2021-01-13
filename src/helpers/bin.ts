import fetch from 'node-fetch';
import { encode } from 'querystring';
import { BinError } from '../misc/BinError';

export async function createBin(options: {
  code: string;
  lang?: string;
  lifetime?: string;
  maxusages?: string;
}): Promise<string> {
  return fetch('https://bin.readthedocs.fr/new', {
    method: 'POST',
    body: encode(options),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }).then((res) => {
    if (res.ok) {
      return res.url;
    }

    throw new BinError(res.statusText, res.status);
  });
}
