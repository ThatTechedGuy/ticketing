import express from "express";

/**
 * Automatically handles unhandled promise rejections in async functions.
 */
import "express-async-errors";

import { json } from "body-parser";

import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.use(json());

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
  } catch (err) {
    console.error("Failed to connect to auth-mongo sevice:", err);
  }

  app.listen(3000, () =>
    console.log("Auth service has started running. Listening on port 3000!")
  );
};

init();
