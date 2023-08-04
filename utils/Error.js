// Define a custom error class that extends the built-in Error class
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the constructor of the base Error class with the provided message

    this.statusCode = statusCode; // Assign the statusCode property to the provided statusCode
  }
}

module.exports = CustomError; // Export the CustomError class so that it can be used in other modules
