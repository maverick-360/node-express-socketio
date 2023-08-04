// Export a function named asyncHandler that takes a controller function as a parameter
exports.asyncHandler = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next); // Execute the controller function and await its completion
  } catch (error) {
    next(error) // Pass any caught error to the next middleware or error handler
  }
};
