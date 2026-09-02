/**
 * Business error carrying the HTTP code that matches it.
 *
 * The services throw this error when something breaks a rule,
 * for example: throw new HttpError(404, "The clinic does not exist").
 *
 * The error-handler middleware catches it and builds the JSON response,
 * so the same res.status(...).json(...) does not have to be repeated
 * in every controller.
 */
export class HttpError extends Error {
    // HTTP status code that will be returned to the client.
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        // super(message) stores the message in the "message" property
        // that the JavaScript Error class already provides.
        super(message);

        this.statusCode = statusCode;
    }
}
