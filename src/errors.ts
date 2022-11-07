const canCapture = typeof Error.captureStackTrace === 'function';
const canStack = !!new Error().stack;

interface ErrorAbstractConstructor {
    new (message: string): Error;
}
interface ErrorAbstract {
    message: string;
    name: string;
    stack?: string;
}
// workaround for ES5 compilation to preserve the Error class
const ErrorAbstract = function (this: ErrorAbstract, message: string) {
    Error.call(this, message);

    this.message = message;
    this.name = this.constructor.name;

    if (canCapture) Error.captureStackTrace(this);
    else if (canStack) this.stack = new Error().stack;
    else this.stack = '';
} as unknown as ErrorAbstractConstructor;

ErrorAbstract.prototype = Object.create(Error.prototype);

export class MissingUserId extends ErrorAbstract {}

export class MisconfiguredClient extends ErrorAbstract {}

export class APIError extends ErrorAbstract {
    response: Response;

    constructor(msg: string, response: Response) {
        super(msg);
        this.response = response;
    }
}

export class InvalidInputData extends ErrorAbstract {
    constructor(msg: string, errorInfo: string[]) {
        super(`${msg}: \n\t${errorInfo.join('\n\t')}`);
    }
}
