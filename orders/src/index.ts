import mongoose from "mongoose";
import { app } from "./app";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";

const init = async () => {
  /* Check if environmental variables have been defined */
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY not defined");
  }

  if (!process.env.MONGO_URI) {
    throw Error("MONGO_URI not defined");
  }

  if (!process.env.NATS_URL) {
    throw Error("NATS_URL not defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw Error("NATS_CLUSTER_ID not defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw Error("NATS_CLIENT_ID not defined");
  }

  /* Try connecting to the auth mongodb database ClusterIP service. */
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");

    app.listen(3000, () =>
      console.log("Orders service has started running. Listening on port 3000!")
    );
  } catch (err) {
    console.error("Failed to connect to orders-mongo sevice:", err);
  }
};

init();
