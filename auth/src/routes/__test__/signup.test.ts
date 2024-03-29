import request from "supertest";
import { app } from "../../app";

it("returns 201 on a successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "invalidemail",
      password: "password",
    })
    .expect(400);
});

it("returns 400 with missing email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);
});

it("returns 400 with missing password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("returns 400 with missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("returns 400 with empty email and password strings", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();
});
