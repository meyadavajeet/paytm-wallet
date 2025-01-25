const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    NODE_DEBUG: process.env.NODE_DEBUG,
    MONGO_URI: process.env.MONGO_URI,
}