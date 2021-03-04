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
    it("should return a randomly chosen jumpling from the DB", async () => {
        const response = await request(app).get("/jumplings/presenter").expect(200);
        expect(Object.keys(response.body).length).toEqual(3)
    });
  });

  describe("GET /jumplings/:name", () => {
    it("should retrieve jumpling with requested name", async () => {
      const requestedJumpling = { name: "Person 1" };
      const response = await request(app).get("/jumplings/Person 1").expect(200);
      expect(response.body).toMatchObject(requestedJumpling)
    });
  });

  describe("POST /jumplings", () => {
    it("should create new jumpling & save it in DB & return it if fields are valid", async () => {
        const newJumpling = { name: "Testing123" };
        const response = await request(app).post("/jumplings").send(newJumpling).expect(201);
        expect(response.status).toEqual(201);
        expect(response.body).toMatchObject(newJumpling)
    });

    it("should throw error if name is empty", async () => {
        const newJumpling = { name: "" };
        const response = await request(app).post("/jumplings").send(newJumpling).expect(500);
        expect(response.status).toBe(500);
    });

    it("should throw error if name is too short", async () => {
        const newJumpling = { name: "a" };
        const response = await request(app).post("/jumplings").send(newJumpling).expect(500);
        expect(response.status).toBe(500);
    });
  });

  describe("PUT /jumplings/:id", () => {
    it("should modify specified jumpling if fields are valid and return it", async () => {
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = { name: "Testing123" };

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling) 
      .expect(200)

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Testing123')
      expect(response.body).toMatchObject(newJumpling)

    });

    it("should throw error if name is empty", async () => {
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = { name: "" };

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling) 
      .expect(500)

      expect(response.status).toBe(500);

    });

    it("should throw error if request body is not json", async () => {
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = "";

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling) 
      .expect(400)

      expect(response.status).toBe(400);
    });

    it("should throw error if you are trying to put a non-existent jumpling", async () => {
      const newJumpling = { name: "testing123" };
      const nonExistingJumplingID = "603f3axxxxxxxxx";

      const response = await request(app)
      .put(`/jumplings/${nonExistingJumplingID}`)
      .send(newJumpling) 
      .expect(500)

      expect(response.status).toBe(500);

    });

  });

  describe("DELETE /jumplings/:id", () => {
    it("should delete jumpling if it exists and then return it", async () => {
          const jumpling = await Jumpling.findOne({ name: "Person 1" });
          const expectedDeletedJumpling = { name: "Person 1" };

          const response = await request(app)
          .delete(`/jumplings/${jumpling._id}`)
          .expect(200)

          expect(response.status).toBe(200)
          expect(response.body).toMatchObject(expectedDeletedJumpling)
    });

    it("should throw error if jumpling does not exist", async () => {
        const nonExistingJumplingID = "603f3axxxxxxxxx";
        const nonExistingJumpling = { name: "Person 3 NA" };
        const jumpling = await Jumpling.findOne(nonExistingJumpling); //would not be able to find the jumpling => hence the jumpling variable will be a falsy value
        if (!jumpling) {
          const response = await request(app).delete(`/jumplings/${nonExistingJumplingID}`).expect(500)
          expect(response.status).toBe(500);
        }

    });

    it("should throw error if jumpling does not exist", async () => {
        const response = await request(app).delete("/jumplings/6sd2anonExistingJumplingID32423s").expect(500);
        expect(response.status).toBe(500);
      });

  });
});

