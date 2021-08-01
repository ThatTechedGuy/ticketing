import mongoose from "mongoose";
import { generateId, signin } from "../../test/util";
import request from "supertest";
import { app } from "./../../app";

import { Order, OrderStatus } from "./../../models/order";
import { Ticket } from "./../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();
  const cookie = signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId })
    .expect(404);
});
it("returns an error if the ticket is already reserved", async () => {
  const userId = generateId();
  const cookie = signin();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: generateId(),
  });
  await ticket.save();
  const order = Order.build({
    userId,
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});
it("reserves a ticket", async () => {
  const cookie = signin();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: generateId(),
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("reserves a ticket and emits an order created event", async () => {
  const cookie = signin();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: generateId(),
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
