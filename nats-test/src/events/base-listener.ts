import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Listener<T extends Event> {
  /* Name of the channel listener is going to listen to */
  abstract subject: T["subject"];
  /* Name of the queue the listener will join */
  abstract queueGroupName: string;
  /* Function to be implemented when an event is received */
  abstract onMessage: (data: T["data"], msg: Message) => void;
  /* Pre-initialized NATS client */
  private client: Stan;
  /* Maximum number of seconds needed to acknowledge */
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions = () => {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  };

  listen = () => {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  };

  parseMessage = (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      return JSON.parse(data);
    }
    /* If the data is of type 'buffer' */
    return JSON.parse(data.toString("utf-8"));
  };
}
