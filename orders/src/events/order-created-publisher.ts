import { Publisher, OrderCreatedEvent, Subjects } from "@ttgticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
