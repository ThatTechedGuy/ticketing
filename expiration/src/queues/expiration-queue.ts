import Queue from "bull";

interface Payload {
  orderId: string;
}

/* Bucket inside the redis instance in which the job information will be stored */
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST!,
  },
});

expirationQueue.process(async (job) => {
  console.log("Publishing expiration event for orderId", job.data.orderId);
});

export { expirationQueue };
