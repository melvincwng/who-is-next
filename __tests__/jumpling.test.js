const app = require("../src/app");
const request = require("supertest");
const dbHandlers = require("../test/dbHandler")
const Jumpling = require("../src/models/jumpling.model");

describe("jumplings", () => {

  beforeAll(async () => await dbHandlers.connect()); //set up mongoose DB (mongoose + mongoDB)
  
  beforeEach(async () => {
    const jumplingData = [
      {
        name: "Person 1",
      },
      {
        name: "Person 2",
      },
    ];
    await Jumpling.create(jumplingData); //saving jumplingData into the DB
  });

  afterEach(async () => await dbHandlers.clearDatabase()); //clear the DB after each test case

  afterAll(async () => await dbHandlers.closeDatabase()); //close the DB after all the test cases

  describe("GET /jumplings", () => {
    it("should retrieve an array of jumplings", async () => {
        const expectedResponse = [ { name: "Person 1" }, { name: "Person 2" } ];
        const response = await request(app).get("/jumplings").expect(200);
        expect(response.body).toMatchObject(expectedResponse)
    });

  });

  describe("GET /jumplings/presenter", () => {
    it("should return a random jumpling", async () => {});
  });

  describe("GET /jumplings/:name", () => {
    it("should retrieve jumpling with requested name", async () => {});
  });

  describe("POST /jumplings", () => {
    it("should create new jumpling if fields are valid", async () => {});

    it("should throw error if name is empty", async () => {});

    it("should throw error if name is too short", async () => {});
  });

  describe("PUT /jumplings/:id", () => {
    it("should modify specified jumpling if fields are valid", async () => {});

    it("should throw error if name is empty", async () => {});

    it("should throw error if request body is not json", async () => {});
  });

  describe("DELETE /jumplings/:id", () => {
    it("should delete jumpling if jumpling exists", async () => {});

    it("should throw error if jumpling does not exist", async () => {});
  });
});

/*
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

it("GET /jumplings/presenter should return a randomly chosen person from the jumplings array", async () => {
    const response = await request(app).get("/jumplings/presenter").expect(200);
    expect(Object.keys(response.body).length).toEqual(2) // instead of { "id": 2, "name": "xxx" } as seen in question paper, just test that the response.body.length = 1 (aka returns an object)
}); */