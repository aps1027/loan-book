require("dotenv").config();
module.exports = {
  env: {
    LOADING_COUNT: process.env.LOADING_COUNT,
    MONGODB_URL: process.env.MONGODB_URL,
    LOAN_DB_NAME: process.env.LOAN_DB_NAME,
    USER_COLLECTION_NAME : process.env.USER_COLLECTION_NAME,
    LOAN_COLLECTION_NAME: process.env.LOAN_COLLECTION_NAME,
  },
};
