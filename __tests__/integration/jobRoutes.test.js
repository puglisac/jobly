const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/company")
const Job = require("../../models/job")

describe("jobs Routes Test", function() {
    let testId;
    beforeEach(async function() {
        await db.query("DELETE FROM companies");

        const c1 = await Company.create(
            "test",
            "Test Company",
            200,
            "This is my test company",
            "https://testurl.com/testimg.jpg"
        );
        let j = await Job.create(
            "test job",
            50000.86,
            0.4,
            "test"
        );
        testId = j.id;
    });


    describe("get /", function() {
        test("can get all jobs", async function() {
            const resp = await request(app)
                .get("/jobs/")

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                jobs: [{
                    id: expect.any(Number),
                    title: "test job",
                    salary: 50000.86,
                    equity: .4,
                    company_handle: "test",
                    date_posted: expect.any(String)
                }]
            });
        });

        test("can search by name", async function() {
            const resp = await request(app)
                .get("/jobs/?search=test")
            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                jobs: [{
                    id: expect.any(Number),
                    title: "test job",
                    salary: 50000.86,
                    equity: .4,
                    company_handle: "test",
                    date_posted: expect.any(String)
                }]
            })
        });
        test("can search by salary", async function() {
            const resp = await request(app)
                .get("/jobs/?min_salary=200&max_salary=80000")
            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                jobs: [{
                    id: expect.any(Number),
                    title: "test job",
                    salary: 50000.86,
                    equity: .4,
                    company_handle: "test",
                    date_posted: expect.any(String)
                }]
            })
        });
        test("can search by salary and return error for min/max", async function() {
            const resp = await request(app)
                .get("/jobs/?min_salary=500000&max_salary=30000")
            expect(resp.status).toEqual(400);
            expect(resp.body).toEqual({
                status: 400,
                message: "max_salary cannot be less than min_salary"
            })
        });
    });

    describe("get /:id", function() {
        test("can get job details ", async function() {
            const resp = await request(app)
                .get(`/jobs/${testId}`)

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                job: {
                    id: expect.any(Number),
                    title: "test job",
                    salary: 50000.86,
                    equity: .4,
                    company_handle: "test",
                    date_posted: expect.any(String)
                }
            });
        });
        test("return 404 if not found ", async function() {
            const resp = await request(app)
                .get("/jobs/0")

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                "status": 404,
                "message": `No such job with id: 0`
            });
        });
    });
    describe("post /", function() {
        test("can create new job ", async function() {
            const resp = await request(app)
                .post("/jobs/").send({
                    title: "new job",
                    salary: 20000.00,
                    equity: 0.3,
                    company_handle: "test"
                });

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                job: {
                    id: expect.any(Number),
                    title: "new job",
                    salary: 20000.00,
                    equity: .3,
                    company_handle: "test",
                    date_posted: expect.any(String)
                }
            });
        });

        test("cannot create new company without correct info", async function() {
            const resp = await request(app)
                .post("/jobs/").send({
                    title: "new job",
                    salary: 20000.00,
                    equity: 3,
                    company_handle: "test"
                });

            expect(resp.status).toEqual(400);

        });

    });
    describe("delete /:id", function() {
        test("can delete job ", async function() {
            const resp = await request(app)
                .delete(`/jobs/${testId}`)

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "job deleted"
            });
        });
        test("return 404 if not found ", async function() {
            const resp = await request(app)
                .delete("/jobs/0")

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                "status": 404,
                "message": "No such job with id: 0"
            });
        });
    });
    describe("patch /:id", function() {
        test("can update a job ", async function() {
            const resp = await request(app)
                .patch(`/jobs/${testId}`).send({
                    title: "new job title",
                    salary: 20000.00,
                    equity: .2,
                    company_handle: "test"
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                job: {
                    id: expect.any(Number),
                    title: "new job title",
                    salary: 20000.00,
                    equity: .2,
                    company_handle: "test",
                    date_posted: expect.any(String)
                }
            });
        });

        test("cannot update job without correct info", async function() {
            const resp = await request(app)
                .patch(`/jobs/${testId}`).send({
                    title: 50,
                    salary: "lots of money",
                    equity: 90,
                    company_handle: "test"
                });

            expect(resp.status).toEqual(400);

        });

    });
});

afterAll(async function() {
    await db.end();
});