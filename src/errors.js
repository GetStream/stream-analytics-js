var errors = module.exports;

var canCapture = ( typeof Error.captureStackTrace === 'function');
var canStack = !!(new Error()).stack;

function ErrorAbstract(msg, constructor) {
    this.message = msg;

    Error.call(this, this.message);

    if (canCapture) {
        Error.captureStackTrace(this, constructor);
    } else if (canStack) {
        this.stack = (new Error()).stack;
    } else {
        this.stack = '';
    }
}

errors._Abstract = ErrorAbstract;
ErrorAbstract.prototype = new Error();

errors.MissingUserId = function MissingUserId(msg) {
    ErrorAbstract.call(this, msg);
};
errors.MissingUserId.prototype = new ErrorAbstract();
