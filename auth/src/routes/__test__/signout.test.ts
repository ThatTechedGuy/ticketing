import request from "supertest";
import { app } from "../../app";

it("clears the cookie after sign out", async () => {
  const signupRes = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(signupRes.get("Set-Cookie")).toBeDefined();
  expect(signupRes.get("Set-Cookie")[0]).not.toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );

  const res = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);
    
  expect(res.get("Set-Cookie")).toBeDefined();
  expect(res.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
