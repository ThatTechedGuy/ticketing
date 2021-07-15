import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from "@ttgticketing/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const userId = req.currentUser!.id;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (userId !== ticket.userId) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as updateTicketRouter };
