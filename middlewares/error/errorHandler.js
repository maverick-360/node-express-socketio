exports.notFound = (req, res, next) => {
  const error = new Error(`${req.originalUrl} - Not Found`); // Create a new error with a message indicating the URL that was not found
  error.statusCode = 404; // Set the statusCode property of the error to 404
  next(error); // Pass the error to the next middleware or error handler
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Get the statusCode from the error object, or default to 500 (Internal Server Error)
  res.status(statusCode).json({
    correlationId: res.getHeader('x-correlation-id'),
    message: err.message, // Send the error message in the response
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Send the error stack trace in the response only in development environment
  });
};
