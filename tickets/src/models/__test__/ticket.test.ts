import { generateId } from "../../test/util";
import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // Create ticket instance
  const ticket = Ticket.build({
    price: 50,
    title: "ticket",
    userId: generateId(),
  });
  // Save ticket
  await ticket.save();

  // Fetch twice
  const first = await Ticket.findById(ticket.id);
  const second = await Ticket.findById(ticket.id);

  // Make two seperate changes
  first!.set({ price: 10 });
  second!.set({ price: 20 });

  // Save the first fetched ticket
  await first!.save();
  // Saving the second one should fail because of incorrect version
  try {
    await second!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point in execution");
});

it("increments the version number on subsequent saves", async () => {
  // Create ticket instance
  const ticket = Ticket.build({
    price: 50,
    title: "ticket",
    userId: generateId(),
  });
  // Save ticket
  await ticket.save();
  expect(ticket.version).toStrictEqual(0);
  await ticket.save();
  expect(ticket.version).toStrictEqual(1);
  await ticket.save();
  expect(ticket.version).toStrictEqual(2);
  
});
