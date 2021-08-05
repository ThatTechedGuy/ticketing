import { OrderCreatedEvent, OrderStatus } from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { generateId } from "../../../test/util";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: generateId(),
    status: OrderStatus.Created,
    userId: generateId(),
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: generateId(),
      price: 1000,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  const storedOrder = await Order.findById(data.id);

  if (!storedOrder) {
    throw Error("Should not have reached this.");
  }

  expect(storedOrder.price).toEqual(data.ticket.price);
  expect(storedOrder.userId).toEqual(data.userId);
});

it("acknowledges the event", async () => {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
