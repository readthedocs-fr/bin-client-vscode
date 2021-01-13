export const errors: Record<number, string> = {
  400: 'Error 400 : bad request. You may have input an invalid expiration or maximum usages. If not, please open an issue if it persists.',
  403: 'Error 403 : forbidden. Please open an issue if it persists.',
  404: 'Error 404 : site not found. It may be stopped, or the extension may be misconfigured.',
  405: 'Error 405 : method not allowed. Please open an issue if it persists.',
  408: 'Error 408 : timeout. This is probably due to a small connection problem.',
  413: 'Error 413 : payload too large. Your code is too big for the bin service which refused to process the request.',
  502: 'Error 502 : bad gateway.',
};

export class BinError extends Error {
  public readonly code: number;

  public constructor(message: string, code: number) {
    super(errors[code] || `Error ${code} : ${message}.`);
    this.code = code;
    this.name = this.constructor.name;
  }

  public toString(): string {
    return this.message;
  }
}
