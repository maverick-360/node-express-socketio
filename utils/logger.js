const { format, transports, createLogger } = require("winston");
const { v4 } = require("uuid");

// Define the log format
const logFormat = format.combine(
  format.json(), // Format logs as JSON
  format.timestamp({ format: "YYYY/MM/DD HH:mm:ss" }), // Include timestamp in the specified format
  format.ms(), // Include the time taken to execute each log statement
  format.metadata(),
  format.prettyPrint() // Pretty-print the log entries
);

// Create the main logger
exports.logger = createLogger({
  level: "info", // Set the log level to "info"
  format: logFormat, // Use the defined log format
  transports: [
    // Define the transports (where the logs should be stored)
    process.env.NODE_ENV === "production"
      ? new transports.File({ filename: "monitors.log", level: "info" })
      : new transports.Console(), // Use a file transport for production environment, otherwise use the console
    new transports.File({ filename: "errors.log", level: "error" }), // Use a file transport to store error logs
  ],
});

// Create the request logger
const requestLogger = createLogger({
  format: logFormat, // Use the defined log format
  transports: [new transports.File({ filename: "requests.log" })], // Use a file transport to store request logs
});

exports.reqLogger = async (req, res) => {
  res.setHeader(
    "x-correlation-id",
    req.headers["x-correlation-id"] ? req.headers["x-correlation-id"] : v4()
  );
  const originalJson = await res.json;
  res.json = async function (data) {
    const logData = {
      message: "Request",
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      headers: req.headers,
      body: req.body,
      response: {
        message: "Response",
        status: res.statusCode,
        headers: await res.getHeaders(),
        body: data,
      },
    };
    res.statusCode >= 400
      ? requestLogger.error(logData)
      : requestLogger.info(logData); // Log every request and response details
    await originalJson.call(res, data);
  };
};
