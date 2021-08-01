import { signin, generateId } from "../../test/util";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const createTicket = async () => {
  const ticket = Ticket.build({
    id: generateId(),
    price: 20,
    title: "New ticket",
  });

  await ticket.save();

  return ticket;
};

it("deletes the order", async () => {
  // Create a ticket
  const ticket = await createTicket();
  // Create user cookie
  const user = signin();

  // Build an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch order
  const res = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Check if the order was actually updated properly
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("does not authorize another user to delete a particular user's order", async () => {
  // Create a ticket
  const ticket = await createTicket();
  // Create user cookie
  const user = signin();
  const user2 = signin();

  // Build an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});

it("emits an order cancelled event on successful delete", async () => {
  // Create a ticket
  const ticket = await createTicket();
  // Create user cookie
  const user = signin();

  // Build an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch order
  const res = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Check if the order was actually updated properly
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
