const { logger } = require("../utils/logger");
const { connect } = require("mongoose");

const connectDb = async (uri) => {
  try {
    await connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    logger.info("Database connection established.");
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
};

module.exports = connectDb;
