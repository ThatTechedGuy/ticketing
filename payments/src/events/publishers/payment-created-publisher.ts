import { Publisher, PaymentCreatedEvent, Subjects } from "@ttgticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
