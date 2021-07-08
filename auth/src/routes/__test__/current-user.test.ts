import { signin } from "../../test/util";
import request from "supertest";
import { app } from "../../app";

it("responds with the details of the current user", async () => {
  const cookie = await signin();
  const res = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(res.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const res = await request(app)
    .get("/api/users/currentUser")
    .send()
    .expect(200);
  expect(res.body.currentUser).toEqual(null);
});
