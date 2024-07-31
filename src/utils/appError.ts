class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message); // Inherits the message property from the Error class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // send error messages as response if the error is an operational error and not a programming error

    // Captures the stack trace to exclude the constructor call from it. This helps in locating the origin of the error more accurately.
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
