require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require("cors");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

// //! Uncaught Exception Error...
process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutdown the server due to Uncaught Exception`);
    process.exit(1);
});

// //! Connect Database...
const dbConnect = require("./database/dbConnect");
dbConnect();

// //! Routers...
app.get("/", (req, res) => {
    return res.status(200).json({ success: true, message: "API Works" });
});

// //* User Route...
const userRoute = require("./routers/userRoute");
app.use(userRoute);

// //* Task Route...
const taskRoute = require("./routers/taskRoute");
app.use(taskRoute);

// //* Task Allocation Route...
const taskAllocationRoute = require("./routers/taskAllocationRoute");
app.use(taskAllocationRoute);

// //* Lead Generation Route...
const leadGenerationRoute = require("./routers/leadGenerationRoute");
app.use(leadGenerationRoute);

const server = app.listen(process.env.PORT, (e) => {
    console.log(
        `server running at http://${process.env.HOST}:${process.env.PORT}`
    );
});

// //! Error Handler...
const errors = require("./middleware/errors");
app.use(errors);

// //! Unhandled Rejection...
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutdown the server due to Unhandled Rejection`);
    server.close(() => {
        process.exit(1);
    });
});