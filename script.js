const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const script = express();

script.use(express.json());

if (process.env.NODE_ENV === "development") {
  script.use(morgan("dev"));
}

script.use((req, res, next) => {
  console.log("Hello from middleware");

  next();
});

script.use("/api/v1/users", userRouter);

script.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.errMessage || err.message,
  });
});

module.exports = script;
