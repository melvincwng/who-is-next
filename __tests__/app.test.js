const request = require("supertest");
const app = require("../src/routes/app");

describe("App", () => {
    it("GET / should return a JSON object with 7 property key/value pairs", async () => {
        const expectedResponse = {
            "0": "GET    /",
            "1": "GET    /jumplings",
            "2": "POST   /jumplings",
            "3": "GET /jumplings/:name",
            "4": "PUT /jumplings/:id",
            "5": "DELETE /jumplings/:id",
            "6": "-----------------------",
            "7": "GET    /jumplings/presenter"
          };
        const response = await request(app).get("/").expect(200);
        expect(response.body).toMatchObject(expectedResponse)
    });
  });