import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  OrderStatus,
} from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  onMessage = async (data: PaymentCreatedEvent["data"], msg: Message) => {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw Error("Order not found");
    }

    order.set({ status: OrderStatus.Complete });

    await order.save();

    msg.ack();
  };
}
