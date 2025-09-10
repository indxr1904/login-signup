const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const script = require("./script");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", false);
mongoose.connect(DB).then(() => console.log("DB connected successfully!"));

const port = process.env.PORT || 8000;

const server = script.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! SHUTTING DOWN...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
