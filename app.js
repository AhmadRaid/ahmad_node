const express = require("express");
const app = express();
const router = express.Router();
const userRoute = require("./route/user");
const authRoute = require("./route/auth");
const taskRoute = require("./route/task");
const PORT = process.env.port || 3000;
const bodyParser = require("body-parser");
const connectDB = require("./db/connect");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
     status: err.status,
     error: err,
     message: err.message,
     stack: err.stack
   });
 }


require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/v1/auth", authRoute);

app.use("/api/v1/user", userRoute);

app.use("/api/v1/task", taskRoute);

app.use((err,req,res,next)=>{

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
      
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, (err, d) => {
      console.log(`The Server Start ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
