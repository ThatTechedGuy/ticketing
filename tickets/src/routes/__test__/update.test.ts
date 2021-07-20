import mongoose from "mongoose";
import request from "supertest";
import { app } from "./../../app";
import { generateId, signin } from "../../test/util";

it("returns a 404 if the provided id does not exist", async () => {
  const ticketId = generateId();
  const response = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", signin())
    .send({
      title: "title",
      price: 200,
    })
    .expect(404);
});
it("returns a 401 if the user is not authenticated", async () => {
  const ticketId = generateId();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({
      title: "title",
      price: 200,
    })
    .expect(401);
});
it("returns a 401 if the user does not own the ticket", async () => {
  const validCookie = signin();
  const invalidCookie = signin();

  // Create ticket
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", validCookie)
    .send({
      title: "title",
      price: 200,
    })
    .expect(201);

  const ticketId = res.body.id;

  // Send a request from unauthorized user
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", invalidCookie)
    .send({
      title: "title",
      price: 200,
    })
    .expect(401);

  // Send a request from authorized user
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", validCookie)
    .send({
      title: "title",
      price: 200,
    })
    .expect(201);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = signin();

  // Create ticket
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 200,
    })
    .expect(201);

  const ticketId = res.body.id;

  // Update ticket
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", signin())
    .send({
      price: 200,
    })
    .expect(400);

  // Update ticket
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: -200,
    })
    .expect(400);
});
it("updates the ticket when provided valid inputs", async () => {
  const cookie = signin();

  // Create ticket
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 200,
    })
    .expect(201);

  const ticketId = res.body.id;

  // Update ticket
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 300,
    })
    .expect(201);

  // Fetch updated ticket
  const ticketRes = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send()
    .expect(201);

  const ticket = ticketRes.body;

  expect(ticket.price).toEqual(300);
  expect(ticket.title).toEqual("new title");
});