import express, { Response } from "express";

const router = express.Router();

router.get("/api/users/currentUser", (_, res: Response) => {
  res.send("Current user route");
});

export { router as currentUserRouter };
