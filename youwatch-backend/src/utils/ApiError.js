class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); // Set the message of the error
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors || [];
    this.message = message || "Something went wrong"; // Default message if not provided

    // Only capture the stack trace if it's not already passed in (for debugging purposes)
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
