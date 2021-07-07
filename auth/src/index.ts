import mongoose from "mongoose";
import { app } from "./app";

const init = async () => {
  /* Check if environmental variables have been defined */
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  /* Try connecting to the auth mongodb database ClusterIP service. */
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");

    app.listen(3000, () =>
      console.log("Auth service has started running. Listening on port 3000!")
    );
  } catch (err) {
    console.error("Failed to connect to auth-mongo sevice:", err);
  }
};

init();
