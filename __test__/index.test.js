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

// Other Endpoints:

describe("GET /api/jokes/ (valid user)", () => {
  beforeAll(async () => {
    response = await request(server)
      .post("/api/auth/login")
      .set("authorization", "Bearer")
      .send({ username: "Lucian", password: "Senna" });
  });

  it("Returns Status 200 OK", () => {
    expect(response.statusCode).toBe(200);
  });

  it("Returns JSON object", () => {
    expect(response.type).toBe("application/json");
  });

  it("Token should be in response", () => {
    expect(response.body.token).toBeDefined();
  });

  it("Gets dad jokes", async () => {
    let dadJokes = await request(server)
      .get("/api/jokes/")
      .set("authorization", `Bearer ${response.body.token}`);

    expect(dadJokes.type).toBe("application/json");
    expect(dadJokes).toBeDefined();
  });
});

describe("GET /api/jokes/ (invalid user)", () => {
  it("Returns 400(Bad Request) when no token is given", () => {
    return request(server)
      .get("/api/jokes/")
      .set("authorization", "Bearer ")
      .expect(400);
  });
});
