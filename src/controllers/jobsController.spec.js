const app = require("../app");
const request = require("supertest");

describe("Jobs Controller", () => {
  it("Should be able to get all unpaid jobs", async () => {
    const response = await request(app)
      .get("/jobs/unpaid")
      .set("profile_id", 1)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0].paid).toBe(null);
  });

  it("Should pay for a job", async () => {
    const response = await request(app)
      .post("/jobs/2/pay")
      .set("profile_id", 1)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.paid).toBe(true);
  });
});