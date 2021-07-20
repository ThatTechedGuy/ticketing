import { Publisher, Subjects, TicketCreatedEvent } from "@ttgticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
