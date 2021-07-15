import { signin } from "../../test/util";
import request from "supertest";
import { app } from "./../../app";

const tickets = [
  { title: "Title1", price: 100 },
  { title: "Title1", price: 200 },
  { title: "Title1", price: 300 },
];

const createTicket = (ticket: object) => {
  return request(app).post("/api/tickets").set("Cookie", signin()).send(ticket);
};

it("can fetch all tickets", async () => {
  let requests: any[] = [];
  tickets.map((ticket) => {
    requests.push(createTicket(ticket));
  });
  await Promise.all(requests);

  const response = await request(app).get("/api/tickets").send().expect(201);

  expect(response.body.length).toEqual(tickets.length);
});
