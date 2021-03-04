const app = require("../src/app");
const request = require("supertest");
const dbHandlers = require("../test/dbHandler");
const User = require("../src/models/user.model");
const createJWTToken = require("../src/config/jwt");

describe("users", () => {
    let token;

    beforeAll(async () => {
        await dbHandlers.connect()     
    }); //set up mongoose DB (mongoose + mongoDB)
  
    beforeEach(async () => {
        const userData = [
        {
            username: "user1",
            password: "password123"
        },
        {
            username: "user2",
            password: "password456"
        },
        ];
        await User.create(userData); //saving userData into the DB
        token = createJWTToken(userData[0].username); //Creating a JWT token with the first username in the model
    });

    afterEach(async () => await dbHandlers.clearDatabase()); //clear the DB after each test case

    afterAll(async () => await dbHandlers.closeDatabase()); //close the DB after all the test cases

    describe("GET /users/:username", () => {
        it("should retrieve an array of jumplings", async () => {
            const expectedResponse = [ { name: "Person 1" }, { name: "Person 2" } ];
            const response = await request(app).get("/jumplings").expect(200);
            expect(response.body).toMatchObject(expectedResponse)
        });

    });

    describe("POST /users", () => {
        // happy path
        it("should post a user and return it", async () => {
            const newUser = { username: "user3", password: "password789" };

            const response = await request(app)
            .post("/users")
            .send(newUser)
            .expect(200);

            expect(response.status).toBe(200);
            expect(Object.keys(response.body).length).toBe(4);
            expect(response.body.username).toBe(newUser.username)
        });

        //unhappy paths
        it("should not allow a user to be posted/created & throw an error since username is too short ", async () => {
            const newUser = { username: "a", password: "password789" };

            const response = await request(app)
            .post("/users")
            .send(newUser)
            .expect(500);

            expect(response.status).toBe(500);
        });

        it("should not allow a user to be posted/created & throw an error since password is too short ", async () => {
            const newUser = { username: "user3", password: "a" };

            const response = await request(app)
            .post("/users")
            .send(newUser)
            .expect(500);

            expect(response.status).toBe(500);
        });

        it("should not allow a user to be posted/created & throw an error since both username & password are too short ", async () => {
            const newUser = { username: "a", password: "a" };

            const response = await request(app)
            .post("/users")
            .send(newUser)
            .expect(500);

            expect(response.status).toBe(500);
        });
    });

    describe("POST /users/login", () => {
        // happy path
        it("should allow you to login & return a successful login message if correct details are provided", async () => {
            const loginDetails = { username: "user1", password: "password123" };
            const expectedResponse = "You are now logged in!";
            const response = await request(app).post("/users/login").send(loginDetails).expect(200);

            expect(response.status).toBe(200);
            expect(response.text).toBe(expectedResponse); // since we are returning text, use response.text (not response.body)
        });

        // unhappy path
        it("should throw an error & return an error message if incorrect details are provided", async () => {
            const wrongLoginDetails = { username: "user1", password: "wrongpassword" };
            const expectedResponse = "Login failed";
            const response = await request(app).post("/users/login").send(wrongLoginDetails).expect(400);

            expect(response.status).toBe(400);
            expect(response.text).toBe(expectedResponse);
        });

        it("should throw an error since the user profile doesn't exist in DB", async () => {
            const nonExistingLoginDetails = { username: "nonExistingUser", password: "noSuchPassword" };
        
            const response = await request(app).post("/users/login").send(nonExistingLoginDetails).expect(500);

            expect(response.status).toBe(500);
        });

    });

    describe("POST /users/logout", () => {
        it("should retrieve an array of jumplings", async () => {
            const expectedResponse = [ { name: "Person 1" }, { name: "Person 2" } ];
            const response = await request(app).get("/jumplings").expect(200);
            expect(response.body).toMatchObject(expectedResponse)
        });
    });
});
