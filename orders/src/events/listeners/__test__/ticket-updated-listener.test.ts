import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { generateId } from "../../../test/util";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@ttgticketing/common";

const setup = async () => {
  // Create listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({
    id: generateId(),
    title: "Concert",
    price: 100,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    title: "New title",
    price: 9999,
    id: ticket.id,
    userId: generateId(),
    version: ticket.version + 1,
  };
  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it("does not ack if the event has a skipped version number", async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;
  
  try {
    await listener.onMessage(data, msg);
  } catch (err) {

  }

  expect(msg.ack).not.toHaveBeenCalled();
});
