import { Publisher, OrderCancelledEvent, Subjects } from "@ttgticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
