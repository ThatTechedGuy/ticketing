import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS!");

  const publisher = new TicketCreatedPublisher(stan);

  const data = {
    id: "123",
    title: "concert",
    price: 20,
  };

  await publisher.publish(data);

  // const dataStr = JSON.stringify(data);

  // stan.publish("ticket:created", dataStr, () =>
  //   console.log("Event published!")
  // );
});
