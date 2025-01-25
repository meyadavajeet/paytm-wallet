const express = require("express");
const cors = require("cors")

const startupRoute = require("./routes/index.route");
const { PORT, NODE_ENV, NODE_DEBUG } = require("./config/config");
const connectDB = require("./db/mongoose.connection");



const app = express();
app.use(cors());
app.use(express.json()); //Used to parse JSON bodies

connectDB();


app.use("/api/v1", startupRoute);


//listen
app.listen(PORT, () => {
    NODE_DEBUG && console.log(`Node Server Running In ${NODE_ENV} Mode on port no ${PORT}`);
});
app.listen(3000);