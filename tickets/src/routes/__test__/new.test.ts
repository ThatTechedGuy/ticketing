import { Ticket } from "../../models/ticket";
import request from "supertest";
import { app } from "./../../app";
import { signin } from "./../../test/util";

it("has a route handler listening to /api/tickets for POST requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  // cannot be empty
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "", price: 100 })
    .expect(400);

  // cannot be missing
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      price: 100,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  // cannot be negative
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "title", price: -10 })
    .expect(400);

  // cannot be 0
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "title",
      price: 0,
    })
    .expect(400);

  // cannot be missing
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "title",
    })
    .expect(400);

  // cannot be empty
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "title",
      price: "",
    })
    .expect(400);
});

it("creates a ticket with valid price and valid title", async () => {
  let tickets = await Ticket.find();
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "ticketTitle",
      price: 100,
    })
    .expect(201);

  tickets = await Ticket.find();
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(100);
  expect(tickets[0].title).toEqual("ticketTitle");
});
