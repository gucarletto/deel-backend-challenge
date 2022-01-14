const app = require("../app");
const request = require("supertest");

describe("Balance Controller", () => {
  it("Should be able to make a deposit", async () => {
    const response = await request(app)
      .post("/balances/deposit/2")
      .set("profile_id", 1)
      .send({
        "amount": 100,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
})