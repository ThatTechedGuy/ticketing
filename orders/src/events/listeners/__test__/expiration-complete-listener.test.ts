import { ExpirationCompleteEvent } from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { generateId } from "../../../test/util";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    id: generateId(),
  });

  await ticket.save();

  const order = Order.build({
    userId: generateId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, order, ticket, listener, data };
};

it("updates the order status to cancelled", async () => {
  const { msg, order, listener, data } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it("emit an OrderCancelled event", async () => {
  const { msg, order, listener, data } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const args = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(args.id).toEqual(order.id);
});

it("acknowledges the message", async () => {
  const { msg, listener, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
