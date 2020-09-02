const db = require("../../db");
const Company = require("../../models/company");


describe("Test Company class", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM companies");
        let c = await Company.create(
            "test",
            "test company",
            200,
            "Testy",
            "https://testurl.com/testimg.jpg",
        );
    });
    test("can get all companies", async function() {
        let c = await Company.getAll()

        expect(c).toEqual([{
            handle: "test",
            name: "test company",
            num_employees: 200,
            description: "Testy",
            logo_url: "https://testurl.com/testimg.jpg"
        }]);
    });

    test("can create company", async function() {
        let c = await Company.create(
            "apple",
            "apple computers",
            120,
            "we make s",
            "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
        );

        expect(c).toEqual({
            handle: "apple",
            name: "apple computers",
            num_employees: 120,
            description: "we make s",
            logo_url: "https://www.logolynx.com/images/logolynx/s_d2/d22fb987843361c45336b768a27ce7f3.png"
        });
    });


    test("can get company by handle", async function() {
        let c = await Company.getById("test");

        expect(c).toEqual({
            handle: "test",
            name: "test company",
            num_employees: 200,
            description: "Testy",
            logo_url: "https://testurl.com/testimg.jpg",
            jobs: []
        });
    });

});
afterAll(async function() {
    await db.end();
});