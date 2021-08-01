import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "./../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { generateId } from "../../../test/util";
import { OrderCreatedEvent, OrderStatus } from "@ttgticketing/common";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: generateId(),
  });

  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    userId: generateId(),
    status: OrderStatus.Created,
    id: generateId(),
    expiresAt: "asdf",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, msg, data };
};

it("sets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  let updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();

  await listener.onMessage(data, msg);

  updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acknowledges the message", async () => {
  const { listener, ticket, data, msg } = await setup();

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
  expect(data.id).toEqual(args.orderId);
});
