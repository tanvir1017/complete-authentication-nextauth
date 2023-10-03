import mongoose from "mongoose";

export function dbConnect() {
  mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log("db connected"))
    .catch((error) => console.log("hey there is some issues", error.message));
}
