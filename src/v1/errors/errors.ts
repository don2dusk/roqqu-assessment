class HttpError extends Error {
  statusCode: number;
  errors?: {}[];

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

class BadRequestError extends HttpError {
  errors: { field: string; message: string }[];

  constructor(message = "Bad Request", errors: any[] = []) {
    super(message, 400);
    this.errors = this.formatErrors(errors);
  }

  private formatErrors(errors: any[]): { field: string; message: string }[] {
    return errors.map((error) => ({
      field: error.path.join("."), // Convert path array to a string (e.g., "name" or "address.street")
      message: error.message,
    }));
  }
}

class NotFoundError extends HttpError {
  constructor(message = "The resource you are looking for cannot be found!") {
    super(message, 404);
  }
}

class ServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export { ServerError, BadRequestError, HttpError, NotFoundError };
