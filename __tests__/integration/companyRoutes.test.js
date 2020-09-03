const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/company");
const User = require("../../models/user")
let token;
let adminToken;
describe("companies Routes Test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM jobs");
        await db.query("DELETE FROM companies");
        await db.query("DELETE FROM users");
        const c1 = await Company.create(
            "test",
            "Test Company",
            200,
            "This is my test company",
            "https://testurl.com/testimg.jpg"
        );
        let u = await User.register(
            "testing",
            "123",
            "test",
            "user",
            "test@test.com",
            "https://testurl.com/testimg.jpg"
        );
        let admin = await User.register(
            "admin",
            "123",
            "test",
            "user",
            "admin@test.com",
            "https://testurl.com/testimg.jpg",
            true
        );
        const res = await request(app).post("/login").send({
            username: "testing",
            password: "123"
        });
        token = res.body.token
        const response = await request(app).post("/login").send({
            username: "admin",
            password: "123"
        });
        adminToken = response.body.token

    });


    describe("get /", function() {
        test("can get all companies", async function() {
            const resp = await request(app)
                .get("/companies/").send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                companies: [{
                    handle: "test",
                    name: "Test Company",
                    num_employees: 200,
                    description: "This is my test company",
                    logo_url: "https://testurl.com/testimg.jpg"
                }]
            });
        });
        test("can search by name", async function() {
            const resp = await request(app)
                .get("/companies/?search=test").send({ _token: token });
            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                companies: [{
                    handle: "test",
                    name: "Test Company",
                    num_employees: 200,
                    description: "This is my test company",
                    logo_url: "https://testurl.com/testimg.jpg"
                }]
            })
        });
        test("can search by num_employees", async function() {
            const resp = await request(app)
                .get("/companies/?min_employees=200&max_employees=300").send({ _token: token });
            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                companies: [{
                    handle: "test",
                    name: "Test Company",
                    num_employees: 200,
                    description: "This is my test company",
                    logo_url: "https://testurl.com/testimg.jpg"
                }]
            })
        });
        test("can search by num_employees and return error for min/max", async function() {
            const resp = await request(app)
                .get("/companies/?min_employees=500&max_employees=300").send({ _token: token });
            expect(resp.status).toEqual(400);
            expect(resp.body).toEqual({
                status: 400,
                message: "max_employees cannot be less than min_employees"
            })
        });
        test("return 401 if not logged in", async function() {
            const resp = await request(app)
                .get("/companies/").send({ _token: null });
            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            })
        });
    });

    describe("get /:handle", function() {
        test("can get company details ", async function() {
            const resp = await request(app)
                .get("/companies/test").send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                company: {
                    handle: "test",
                    name: "Test Company",
                    num_employees: 200,
                    description: "This is my test company",
                    logo_url: "https://testurl.com/testimg.jpg",
                    jobs: []
                }
            });
        });
        test("return 400 if not found ", async function() {
            const resp = await request(app)
                .get("/companies/test4").send({ _token: token });

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                "status": 404,
                "message": "No such company: test4"
            });
        });
        test("return 401 if not logged in", async function() {
            const resp = await request(app)
                .get("/companies/test").send({ _token: null });
            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            })
        });
    });
    describe("post /", function() {
        test("can create new company ", async function() {
            const resp = await request(app)
                .post("/companies/").send({
                    handle: "apple",
                    name: "apple computers",
                    num_employees: 120,
                    description: "we make s",
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png",
                    _token: adminToken
                });

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                company: {
                    handle: "apple",
                    name: "apple computers",
                    num_employees: 120,
                    description: "we make s",
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
                }
            });
        });
        test("cannot create new company with same handle ", async function() {
            const resp = await request(app)
                .post("/companies/").send({
                    handle: "test",
                    name: "apple computers",
                    num_employees: 120,
                    description: "we make s",
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png",
                    _token: adminToken
                });

            expect(resp.status).toEqual(400);
            expect(resp.body).toEqual({
                "status": 400,
                "message": "Company with handle: test already exists"
            });
        });
        test("cannot create new company without correct info", async function() {
            const resp = await request(app)
                .post("/companies/").send({
                    name: "apple computers",
                    num_employees: 120,
                    description: "we make s",
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png",
                    _token: adminToken
                });

            expect(resp.status).toEqual(400);

        });
        test("return 401 if not admin", async function() {
            const resp = await request(app)
                .post("/companies/").send({ _token: token });
            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            })
        });

    });
    describe("delete /:handle", function() {
        test("can delete company ", async function() {
            const resp = await request(app)
                .delete("/companies/test").send({ _token: adminToken });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "company deleted"
            });
        });
        test("return 404 if not found ", async function() {
            const resp = await request(app)
                .delete("/companies/test4").send({ _token: adminToken })

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                "status": 404,
                "message": "No such company: test4"
            });
        });
        test("return 401 if not admin", async function() {
            const resp = await request(app)
                .delete("/companies/test").send({ _token: token });
            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            })
        });
    });
    describe("patch /", function() {
        test("can update a company ", async function() {
            const resp = await request(app)
                .patch("/companies/test").send({
                    name: "apple computers",
                    num_employees: 120,
                    description: "we make stuff",
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png",
                    _token: adminToken
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                company: {
                    handle: "test",
                    name: "apple computers",
                    num_employees: 120,
                    description: "we make stuff",
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png",
                    jobs: []
                }
            });

        });
        test("return 401 if not admin", async function() {
            const resp = await request(app)
                .patch("/companies/test").send({ _token: token });
            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            })
        });

        test("cannot update company without correct info", async function() {
            const resp = await request(app)
                .patch("/companies/test").send({
                    num_employees: "120",
                    description: 50,
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png",
                    _token: adminToken
                });

            expect(resp.status).toEqual(400);

        });

    });
});

afterAll(async function() {
    await db.end();
});