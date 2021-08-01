import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    // Find the ticket that the order is trying to reserve
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Mark the ticket as being reserved by setting orderId
    ticket.set({
      orderId: data.id,
    });
    // Save the ticket
    await ticket.save();
    // Emit a ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      orderId: ticket.orderId,
      userId: ticket.userId,
      title: ticket.title,
      version: ticket.version,
    });
    // Acknowledge the event
    msg.ack();
  };
}
