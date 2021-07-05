import express from "express";

/**
 * Automatically handles unhandled promise rejections in async functions.
 */
import "express-async-errors";

import { json } from "body-parser";
import cookieSession from "cookie-session";

import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

import { NotFoundError } from "./errors/not-found-error";

const app = express();
/**
 * Since the traffic is being proxied through ingress-nginx,
 * make express trust the reverse proxy.
 */
app.set("trust proxy", true);
app.use(json());

/**
 * For the purposes of storing the JWT token,
 */
app.use(
  cookieSession({
    // Disabling encryption because the JWT is already encrypted
    signed: false,
    // Over HTTPS protocol only
    secure: true,
  })
);

/**
 * Route middlewares - Authentication
 */
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

/**
 * 404 - Throw an error if the user encounters an unknown route.
 */
app.all("*", async () => {
  throw new NotFoundError();
});

/**
 * Error Handling Middleware
 */
app.use(errorHandler);

const init = async () => {
  /**
   * Try connecting to the auth mongodb database ClusterIP service.
   */
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
