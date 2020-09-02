const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/company")

describe("companies Routes Test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM jobs");
        await db.query("DELETE FROM companies");

        const c1 = await Company.create(
            "test",
            "Test Company",
            200,
            "This is my test company",
            "https://testurl.com/testimg.jpg"
        );

    });


    describe("get /", function() {
        test("can get all companies", async function() {
            const resp = await request(app)
                .get("/companies/")

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
                .get("/companies/?search=test")
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
                .get("/companies/?min_employees=200&max_employees=300")
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
                .get("/companies/?min_employees=500&max_employees=300")
            expect(resp.status).toEqual(400);
            expect(resp.body).toEqual({
                status: 400,
                message: "max_employees cannot be less than min_employees"
            })
        });
    });

    describe("get /:handle", function() {
        test("can get company details ", async function() {
            const resp = await request(app)
                .get("/companies/test")

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
                .get("/companies/test4")

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                "status": 404,
                "message": "No such company: test4"
            });
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
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
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
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
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
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
                });

            expect(resp.status).toEqual(400);

        });

    });
    describe("delete /:handle", function() {
        test("can delete company ", async function() {
            const resp = await request(app)
                .delete("/companies/test")

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "company deleted"
            });
        });
        test("return 404 if not found ", async function() {
            const resp = await request(app)
                .delete("/companies/test4")

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                "status": 404,
                "message": "No such company: test4"
            });
        });
    });
    describe("patch /", function() {
        test("can update a company ", async function() {
            const resp = await request(app)
                .patch("/companies/test").send({
                    name: "apple computers",
                    num_employees: 120,
                    description: "we make stuff",
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
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

        test("cannot update company without correct info", async function() {
            const resp = await request(app)
                .patch("/companies/test").send({
                    num_employees: "120",
                    description: 50,
                    logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
                });

            expect(resp.status).toEqual(400);

        });

    });
});

afterAll(async function() {
    await db.end();
});