import { Listener, OrderCreatedEvent, Subjects } from "@ttgticketing/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log("Waiting for " + delay / 1000 + " seconds to process the job.");

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        /* An amount of miliseconds to wait until this job can be processed. */
        delay,
      }
    );

    msg.ack();
  };
}
