import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@ttgticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { generateId } from "../../../test/util";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: generateId(),
    version: 0,
    title: "Concert",
    price: 10,
    userId: generateId(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves the ticket", async () => {
  const { listener, data, msg } = await setup();
  // call onMessage(data, message)
  await listener.onMessage(data, msg);
  // write assertions to make sure ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
it("acknowledges the message", async () => {
  const { listener, data, msg } = await setup();
  // call onMessage(data, message)
  await listener.onMessage(data, msg);
  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalledTimes(1);
});
