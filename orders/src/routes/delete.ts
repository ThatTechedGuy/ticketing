import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@ttgticketing/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    // Make sure user owns the order
    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }
    // Apply the status update
    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    // Publish order cancellation event
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
