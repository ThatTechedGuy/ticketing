import { signin, generateId } from "../../test/util";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

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

it("fetches order for a particular user", async () => {
  // Create 3 tickets
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();
  // Create users
  const user1 = signin();
  const user2 = signin();
  // One order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);
  // Two orders as User #2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);
  // Make request to get orders as User #2
  const res = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(201);

  // Expect to receive only the two orders associated with User #2
  expect(res.body).toHaveLength(2);
  expect(res.body[0].id).toContain(order1.id);
  expect(res.body[1].id).toContain(order2.id);

  expect(res.body[0].ticket.id).toContain(ticket2.id);
  expect(res.body[1].ticket.id).toContain(ticket3.id);
});
