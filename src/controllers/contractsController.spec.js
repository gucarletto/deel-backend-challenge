const app = require("../app");
const request = require("supertest");

describe("Contracts Controller", () => {
  it("Should be able get a contract by its id", async () => {
    const response = await request(app)
      .get("/contracts/1")
      .set('profile_id', 1)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("Should return a list of contracts", async () => {
    const response = await request(app)
      .get("/contracts")
      .set('profile_id', 1)
      .send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});