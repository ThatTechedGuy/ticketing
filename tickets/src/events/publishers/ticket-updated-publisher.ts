import { Publisher, Subjects, TicketUpdatedEvent } from "@ttgticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
