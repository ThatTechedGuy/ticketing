import express from "express";
/**
 * Automatically handles unhandled promise rejections in async functions.
 */
import "express-async-errors";

import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@ttgticketing/common";
import { createChargeRouter } from "./routes/new";

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
    secure: process.env.NODE_ENV !== "test",
  })
);

/**
 * Route middlewares - Tickets
 */
app.use(currentUser);
app.use(createChargeRouter);

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

export { app };
