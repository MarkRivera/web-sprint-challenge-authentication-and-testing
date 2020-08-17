const server = require("../api/server");
const request = require("supertest");
const db = require("../database/dbConfig");

beforeAll(async () => {
  await db("users").truncate();
});

describe("POST /api/auth/register", () => {
  it("Receives status code 201(Created) from endpoint", () => {
    return request(server)
      .post("/api/auth/register")
      .send({ username: "Lucian", password: "Senna" })
      .expect(201);
  });

  it("Receives status code 400(Bad Request) when user already exists", () => {
    return request(server)
      .post("/api/auth/register")
      .send({ username: "Lucian", password: "Senna" })
      .expect(400);
  });
});

describe("POST /api/auth/login", () => {
  it("returns 200(OK) when user logs in", () => {
    return request(server)
      .post("/api/auth/login")
      .send({ username: "Lucian", password: "Senna" })
      .expect(200);
  });

  it("returns 400(Bad Request) when user info is wrong", () => {
    return request(server)
      .post("/api/auth/login")
      .send({ username: "Lucian", password: "1234" })
      .expect(400);
  });
});
