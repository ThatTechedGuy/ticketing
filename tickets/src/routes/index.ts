import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (_, res: Response) => {
  const tickets = await Ticket.find();
  res.status(201).send(tickets);
});

export { router as showAllTicketsRouter };
