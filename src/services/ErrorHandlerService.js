export class ErrorHandlerService extends Error {
  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static notFoundError(message = "Not Found") {
    return new ErrorHandlerService(404, message);
  }

  static alreadyExistError(message = "Allready Exist") {
    return new ErrorHandlerService(409, message);
  }

  static unAuthorizedError(message = "UnAuthorized") {
    return new ErrorHandlerService(401, message);
  }

  static badRequestError(message = "Bad Request") {
    return new ErrorHandlerService(400, message);
  }

  static forbiddenError(message = "Not Allowed") {
    return new ErrorHandlerService(403, message);
  }
}
