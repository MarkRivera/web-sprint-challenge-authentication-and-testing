const server = require("../api/server");
const request = require("supertest");
const db = require("../database/dbConfig");

beforeAll(async () => {
  await db("users").truncate();
});

describe("POST /api/auth/register", () => {
  beforeAll(async () => {
    response = await request(server).post("/api/auth/register").send({
      username: "Lucian",
      password: "Senna",
    });
  });

  it("Receives status code 201(Created) from endpoint", () => {
    expect(response.statusCode).toBe(201);
  });

  it("Receives JSON object", () => {
    expect(response.type).toBe("application/json");
  });
});

describe("POST /api/auth/register", () => {
  beforeAll(async () => {
    response = await request(server).post("/api/auth/register").send({
      username: "Lucian",
      password: "Senna",
    });
  });

  it("Receives status code 400(Bad Request) when user already exists", () => {
    expect(response.statusCode).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    response = await request(server)
      .post("/api/auth/login")
      .send({ username: "Lucian", password: "Senna" });
  });

  it("returns 200(OK) when user logs in", () => {
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /api/auth/login  (Invalid Credentials)", () => {
  beforeAll(async () => {
    response = await request(server).post("/api/auth/login").send({
      username: "Lucian",
      password: "12345",
    });
  });

  it("returns 400(Bad Request) when user info is wrong", () => {
    expect(response.statusCode).toBe(400);
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
});

describe("GET /api/jokes/", () => {
  beforeAll(async () => {
    response = await request(server)
      .post("/api/auth/login")
      .send({ username: "Lucian", password: "Senna" });
    dadJokes = await request(server)
      .get("/api/jokes/")
      .set("authorization", `Bearer ${response.body.token}`);
  });

  it("Dad jokes should exist", () => {
    expect(dadJokes.body).toBeDefined();
  });

  it("returns an array of JSON objects", () => {
    expect(dadJokes.type).toBe("application/json");
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
