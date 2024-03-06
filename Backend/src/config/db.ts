import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();
export const connectdb = async () => {
  try {
    let url = process.env.CHATIFY_DEMO_MONGO_URL;
    if(!url)
    throw new Error("Mongodb URL is not provided or not correct")
    await mongoose
      .connect(process.env.CHATIFY_DEMO_MONGO_URL!)
      .then(() => {
        console.log("Connected db....");
      })
      .catch((error) => {
        console.log(error, "Disconnected");
      });
  } catch (err) {
    console.log(err);
  }
};
