import { generateId, signin } from "../../test/util";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.setTimeout(15000);

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({ orderId: generateId(), token: generateId() })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    version: 0,
    price: 1000,
    status: OrderStatus.Created,
    userId: generateId(),
    id: generateId(),
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({ orderId: order.id, token: generateId() })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = generateId();

  const order = Order.build({
    version: 0,
    price: 1000,
    status: OrderStatus.Cancelled,
    userId,
    id: generateId(),
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({ orderId: order.id, token: generateId() })
    .expect(400);
});

it("returns a 204 with valid inputs", async () => {
  const userId = generateId();
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    version: 0,
    price: price,
    status: OrderStatus.Created,
    userId,
    id: generateId(),
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({ orderId: order.id, token: "tok_visa" })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );
  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("inr");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
