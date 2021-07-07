import CustomError from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  reason = "Access denied";

  constructor() {
    super("Access denied");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
