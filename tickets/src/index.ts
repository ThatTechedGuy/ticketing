import mongoose from "mongoose";
import { app } from "./app";

const init = async () => {
  /* Check if environmental variables have been defined */
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  if (!process.env.MONGO_URI) {
    throw Error("MONGO_URI not defined");
  }

  /* Try connecting to the auth mongodb database ClusterIP service. */
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");

    app.listen(3000, () =>
      console.log(
        "Tickets service has started running. Listening on port 3000!"
      )
    );
  } catch (err) {
    console.error("Failed to connect to tickets-mongo sevice:", err);
  }
};

init();
