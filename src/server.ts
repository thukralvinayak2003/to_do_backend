import mongoose from "mongoose";
import app from "./app";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);

  process.exit(1);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Connecting to port ${PORT} complete`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`Mongo connected to port ${PORT}`);
  })
  .catch((e: Error) => {
    console.log(`${e.message} did not connect`);
  });

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
