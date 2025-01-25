const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/config");


const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            `Connected to mongo database ${mongoose.connection.host}`
        );
    } catch (error) {
        console.log(`Mongodb Error ${error}`);
    }
};

module.exports = {
    connectDB
};