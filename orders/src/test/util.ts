import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signin = () => {
  // Build JWT payload
  const payload = {
    id: generateId(),
    email: "test@test.com",
  };

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session object {jwt: USER_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Base64 encode the JSON object
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Generate and return cookie with encoded data
  return [`express:sess=${base64}`];
};

export const generateId = () => new mongoose.Types.ObjectId().toHexString();
