const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const User = require("../../models/user")

let token;
describe("user Routes Test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM users");

        let u = await User.register(
            "testing",
            "123",
            "test",
            "user",
            "test@test.com",
            "https://testurl.com/testimg.jpg"
        );
        const res = await request(app).post("/login").send({
            username: "testing",
            password: "123"
        });
        token = res.body.token
    });


    describe("get /", function() {
        test("can get all users", async function() {
            const resp = await request(app)
                .get("/users/")

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                users: [{
                    username: "testing",
                    first_name: "test",
                    last_name: "user",
                    email: "test@test.com",
                }]
            });
        });
    });

    describe("get /:id", function() {
        test("can get user details ", async function() {
            const resp = await request(app)
                .get(`/users/testing`)

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                user: {
                    username: "testing",
                    first_name: "test",
                    last_name: "user",
                    email: "test@test.com",
                    photo_url: "https://testurl.com/testimg.jpg",
                    is_admin: false,
                    jobs: expect.any(Array)
                }
            });
        });
        test("return 404 if not found ", async function() {
            const resp = await request(app)
                .get("/users/notauser")

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                status: 404,
                message: `No such user: notauser`
            });
        });
    });
    describe("post /", function() {
        test("can create new user ", async function() {
            const resp = await request(app)
                .post("/users/").send({
                    username: "newuser",
                    password: "password",
                    first_name: "new",
                    last_name: "name",
                    email: "test.user@email.com",
                    photo_url: "",
                    is_admin: true
                });

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                token: expect.any(String)

            });
        });

        test("cannot create new user without correct info", async function() {
            const resp = await request(app)
                .post("/users/").send({
                    username: "newuser",
                    first_name: "new",
                    last_name: "name",
                    email: "test.user@email.com",
                    photo_url: "",
                    is_admin: true
                });

            expect(resp.status).toEqual(400);

        });

    });
    describe("delete /:username", function() {
        test("can delete a user ", async function() {
            const resp = await request(app)
                .delete(`/users/testing`).send({ "_token": token })

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "user deleted"
            });
        });
        test("return 401 if not authorized ", async function() {
            const resp = await request(app)
                .delete("/users/notauser").send({ "_token": token })

            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            });
        });
    });
    describe("patch /:username", function() {
        test("can update a user ", async function() {
            const resp = await request(app)
                .patch(`/users/testing`).send({
                    first_name: "new",
                    last_name: "name",
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                user: {
                    username: "testing",
                    first_name: "new",
                    last_name: "name",
                    email: "test@test.com",
                    photo_url: "https://testurl.com/testimg.jpg",
                    is_admin: false,
                    jobs: expect.any(Array)
                }
            });
        });

        test("cannot update user without correct info", async function() {
            const resp = await request(app)
                .patch(`/users/testing`).send({
                    is_admin: 84,
                    _token: token
                });

            expect(resp.status).toEqual(400);

        });

    });
});

afterAll(async function() {
    await db.end();
});