const db = require("../../db");
const Company = require("../../models/company");
const Job = require("../../models/job")

describe("Test job class", function() {
    let testId;
    beforeEach(async function() {
        await db.query("DELETE FROM jobs");
        await db.query("DELETE FROM companies")
        let c = await Company.create(
            "test",
            "test company",
            200,
            "Testy",
            "https://testurl.com/testimg.jpg",
        );
        let j = await Job.create(
            "test job",
            50000.86,
            0.4,
            "test"
        );
        testId = j.id;
    });
    test("can get all jobs", async function() {
        let j = await Job.getAll()

        expect(j).toEqual([{
            id: expect.any(Number),
            title: "test job",
            salary: 50000.86,
            equity: .4,
            company_handle: "test",
            date_posted: expect.any(Date)
        }]);
    });

    test("can create a job", async function() {
        let j = await Job.create(
            "new job",
            49876.00,
            0.5,
            "test"
        );

        expect(j).toEqual({
            id: expect.any(Number),
            title: "new job",
            salary: 49876.00,
            equity: 0.5,
            company_handle: "test",
            date_posted: expect.any(Date)
        });
    });
    test("can get job by id", async function() {
        let j = await Job.getById(testId);

        expect(j.id).toEqual(testId);
    });

});
afterAll(async function() {
    await db.end();
});