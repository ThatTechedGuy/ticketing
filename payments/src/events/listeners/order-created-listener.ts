import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "./../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      version: data.version,
      userId: data.userId,
    });

    await order.save();

    msg.ack();
  };
}
