export class ErrorHandlerService extends Error {
  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static notFoundError(message = "Not Found") {
    return ErrorHandlerService(404, message);
  }

  static alreadyExistError(message = "Allready Exist") {
    return ErrorHandlerService(409, message);
  }

  static unAuthorizedError(message = "UnAuthorized") {
    return ErrorHandlerService(401, message);
  }

  static badRequestError(message = "Bad Request") {
    return ErrorHandlerService(400, message);
  }

  static forbiddenError(message = "Not Allowed") {
    return ErrorHandlerService(403, message);
  }
}
