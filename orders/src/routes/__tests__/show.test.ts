import { signin, generateId } from "../../test/util";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const createTicket = async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "New ticket",
    id: generateId(),
  });

  await ticket.save();

  return ticket;
};

it("fetches the order", async () => {
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
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(201);

  expect(res.body.id).toEqual(order.id);
  expect(res.body.ticket.id).toEqual(ticket.id);
});

it("does not authorize another user to fetch a particular user's order", async () => {
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
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});
