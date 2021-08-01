import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "./../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { generateId } from "../../../test/util";
import { OrderCancelledEvent, OrderStatus } from "@ttgticketing/common";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = generateId();

  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: generateId(),
  });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, msg, data, orderId };
};

it("sets the orderId of the ticket to be undefined", async () => {
  const { listener, ticket, data, msg } = await setup();

  let updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);

  await listener.onMessage(data, msg);

  updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("acknowledges the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // @ts-ignore
  const args = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(args.orderId).not.toBeDefined();
});
