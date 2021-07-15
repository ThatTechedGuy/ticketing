import { generateId, signin } from "../../test/util";
import request from "supertest";
import { app } from "./../../app";

it("returns a 404 if the ticket is not found", async () => {
  const id = generateId();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});
it("returns the ticket if the ticket is found", async () => {
  const title = "big concert";
  const price = 200;

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price })
    .expect(201);

  const ticketId = res.body.id;

  const ticketRes = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send()
    .expect(201);
  const ticket = ticketRes.body;
  expect(ticket.title).toEqual(title);
  expect(ticket.price).toEqual(price);
});
