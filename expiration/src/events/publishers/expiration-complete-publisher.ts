import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@ttgticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
