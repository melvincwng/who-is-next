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
        expect(response.body).toMatchObject(expectedResponse);
    });

    it("GET /jumplings should return a empty array", async () => {
        const expectedResponse = [];
        const response = await request(app).get("/jumplings").expect(200);
        expect(response.body).toEqual(expectedResponse)
    });

    it("POST /jumplings should return the person object you posted", async () => {
        const newJumpling = { "name": "Jeff"};
        const expectedResponse = { "id": 1, "name": "Jeff" };
        const response = await request(app).post("/jumplings").send(newJumpling).expect(201);
        expect(response.body).toMatchObject(expectedResponse)
    });

    it("GET /jumplings/:name should return the person object with the correct name", async () => {
        const expectedResponse = { "id": 1, "name": "Jeff" };
        const response = await request(app).get("/jumplings/Jeff").expect(200);
        expect(response.body).toMatchObject(expectedResponse)
    });

    it("PUT /jumplings/:id should return the person object with the edited name", async () => {
        const updatedJumpling = { "name": "Jeff This has been EDITED" };
        const expectedResponse = { "id": 1, "name": "Jeff This has been EDITED" };
        const response = await request(app).put("/jumplings/1").send(updatedJumpling).expect(200);
        expect(response.body).toMatchObject(expectedResponse)
    });

    it("DELETE /jumplings/:id should return the deleted person object", async () => {
        const expectedDeletedResponse = { "id": 1, "name": "Jeff This has been EDITED" };
        const response = await request(app).delete("/jumplings/1").expect(200);
        expect(response.body).toMatchObject(expectedDeletedResponse)
    });

  });