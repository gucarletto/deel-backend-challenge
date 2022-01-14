const app = require("../app");
const request = require("supertest");

describe("Admin Controller", () => {
  it("Should be able get the best profession", async () => {
    const response = await request(app)
      .get("/admin/best-profession?start=2020-08-01&end=2020-08-31")
      .set("profile_id", 1)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("profession");
  });

  it("Should be able get the best clients", async () => {
    const response = await request(app)
      .get("/admin/best-clients?start=2020-08-01&end=2020-08-31")
      .set("profile_id", 1)
      .send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
})