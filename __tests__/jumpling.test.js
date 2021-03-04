const app = require("../src/app");
const request = require("supertest");
const dbHandlers = require("../test/dbHandler")
const Jumpling = require("../src/models/jumpling.model");
const createJWTToken = require("../src/config/jwt");

describe("jumplings", () => {
  let token;

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
    token = createJWTToken("user1"); // simulate us already logged in as user1 and system generate a JWT for us.
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
    // happy path
    it("should create new jumpling, save it in DB and then return it IF fields are valid & if authorized", async () => {
        const newJumpling = { name: "Testing123" };
        const response = await request(app).post("/jumplings").send(newJumpling).set("Cookie", `token=${token}`).expect(201);
        expect(response.status).toEqual(201);
        expect(response.body).toMatchObject(newJumpling)
    });

    // unhappy paths
    it("should throw error if name is empty even IF you are authorized", async () => {
        const newJumpling = { name: "" };
        const response = await request(app).post("/jumplings").send(newJumpling).set("Cookie", `token=${token}`).expect(500);
        expect(response.status).toBe(500);
    });

    it("should throw error if name is too short EVEN if you are authorized", async () => {
        const newJumpling = { name: "a" };
        const response = await request(app).post("/jumplings").send(newJumpling).set("Cookie", `token=${token}`).expect(500);
        expect(response.status).toBe(500);
    });
    it("should throw error even if fields are valid AS you are not authorized", async () => {
      const newJumpling = { name: "Testing123" };
        const response = await request(app).post("/jumplings").send(newJumpling).expect(401);
        expect(response.status).toEqual(401);
        expect(response.text).toBe("You are not authorized");
    });

    it("should throw error as fields are NOT VALID AND you are NOT AUTHORIZED", async () => {
      const newJumpling = { name: "T" };
        const response = await request(app).post("/jumplings").send(newJumpling).expect(401);
        expect(response.status).toEqual(401);
        expect(response.text).toBe("You are not authorized");
    });
  });

  describe("PUT /jumplings/:id", () => {
    // happy path
    it("should modify specified jumpling if fields are valid and return it, PROVIDED IF authorized user", async () => {
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = { name: "Testing123" };

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling)
      .set("Cookie", `token=${token}`)
      .expect(200)

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Testing123')
      expect(response.body).toMatchObject(newJumpling)

    });

    // unhappy paths (if AUTHORIZED user)
    it("should throw error if name is empty EVEN IF AUTHORIZED", async () => {
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = { name: "" };

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling)
      .set("Cookie", `token=${token}`) 
      .expect(500)

      expect(response.status).toBe(500);

    });

    it("should throw error if request body is not json EVEN IF AUTHORIZED", async () => {
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = "";

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling)
      .set("Cookie", `token=${token}`) 
      .expect(400)

      expect(response.status).toBe(400);
    });

    it("should throw error if you are trying to put a non-existent jumpling EVEN IF AUTHORIZED", async () => {
      const newJumpling = { name: "testing123" };
      const nonExistingJumplingID = "603f3axxxxxxxxx";

      const response = await request(app)
      .put(`/jumplings/${nonExistingJumplingID}`)
      .send(newJumpling)
      .set("Cookie", `token=${token}`)
      .expect(500)

      expect(response.status).toBe(500);

    });

    // unhappy paths (if NOT AUTHORIZED USER)
    it("should throw error even if fields are valid AS USER IS NOT AUTHORIZED", async () => {
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = { name: "Testing123" };

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling)
      .expect(401)

      expect(response.status).toBe(401);
      expect(response.text).toBe("You are not authorized")
    });

    it("should throw error AS USER IS NOT AUTHORIZED, somemore input details are invalid", async () => {
      // protectRoute will return an error (401) first before the router handler/controller detects the invalid details error (mongoose schema validation, error 500)
      // hence we will expect error 401 since the route handler will not get to be executed/is skipped.
      const jumpling = await Jumpling.findOne({ name: "Person 1" });
      const newJumpling = { name: "" };

      const response = await request(app)
      .put(`/jumplings/${jumpling._id}`)
      .send(newJumpling) 
      .expect(401)

      expect(response.status).toBe(401);

    });

  });

  describe("DELETE /jumplings/:id", () => {
    // happy path
    it("should delete jumpling if it exists and then return it PROVIDED IF AUTHORIZED USER", async () => {
          const jumpling = await Jumpling.findOne({ name: "Person 1" });
          const expectedDeletedJumpling = { name: "Person 1" };

          const response = await request(app)
          .delete(`/jumplings/${jumpling._id}`)
          .set("Cookie", `token=${token}`)
          .expect(200)

          expect(response.status).toBe(200)
          expect(response.body).toMatchObject(expectedDeletedJumpling)
    });

    // unhappy path (AUTHORIZED USER)
    it("should throw error if jumpling does not exist EVEN IF AUTHORIZED USER", async () => {
        const nonExistingJumplingID = "603f3axxxxxxxxx";
        const nonExistingJumpling = { name: "Person 3 NA" };
        const jumpling = await Jumpling.findOne(nonExistingJumpling); //would not be able to find the jumpling => hence the jumpling variable will be a falsy value
        if (!jumpling) {
          const response = await request(app).delete(`/jumplings/${nonExistingJumplingID}`).set("Cookie", `token=${token}`).expect(500)
          expect(response.status).toBe(500);
        }

    });

    it("should throw error if jumpling does not exist EVEN IF AUTHORIZED USER", async () => {
        const response = await request(app).delete("/jumplings/6sd2anonExistingJumplingID32423s").set("Cookie", `token=${token}`).expect(500);
        expect(response.status).toBe(500);
      });

      // unhappy path (NOT AUTHORIZED USER)
      it("should throw an error when attempting to delete SINCE NOT AUTHORIZED USER", async () => {
        const jumpling = await Jumpling.findOne({ name: "Person 1" });
        const expectedDeletedJumpling = { name: "Person 1" };

        const response = await request(app)
        .delete(`/jumplings/${jumpling._id}`)
        .expect(401)

        expect(response.status).toBe(401);
        expect(response.text).toBe("You are not authorized");
    });

        it("should throw error since jumpling does not exist EVEN IF NOT AUTHORIZED USER", async () => {
          const response = await request(app).delete("/jumplings/6sd2anonExistingJumplingID32423s").expect(500);
          expect(response.status).toBe(500);
        });

  });
});

