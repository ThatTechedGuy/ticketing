import { OrderCancelledEvent, OrderStatus } from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { generateId } from "../../../test/util";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: generateId(),
    status: OrderStatus.Created,
    userId: generateId(),
    version: 0,
    price: 1000,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: generateId(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("replicates the order info", async () => {
  const { listener, msg, data, order } = await setup();

  await listener.onMessage(data, msg);

  const storedOrder = await Order.findById(order.id);

  expect(storedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acknowledges the event", async () => {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
