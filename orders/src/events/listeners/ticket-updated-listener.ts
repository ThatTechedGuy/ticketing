import { Listener, Subjects, TicketUpdatedEvent } from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  onMessage = async (data: TicketUpdatedEvent["data"], msg: Message) => {
    const { id, title, price } = data;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  };
}
