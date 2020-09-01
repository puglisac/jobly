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
            logo_url: "https://testurl.com/testimg.jpg"
        });
    });

    test("can get company by handle", async function() {
        let c = await Company.getById("test");

        expect(c).toEqual({
            handle: "test",
            name: "test company",
            num_employees: 200,
            description: "Testy",
            logo_url: "https://testurl.com/testimg.jpg"
        });
    });
    //     test("can authenticate", async function() {
    //         let isValid = await User.authenticate("test", "password");
    //         expect(isValid).toBeTruthy();

    //         isValid = await User.authenticate("test", "xxx");
    //         expect(isValid).toBeFalsy();
    //     });


    //     test("can update login timestamp", async function() {
    //         await db.query("UPDATE users SET last_login_at=NULL WHERE username='test'");
    //         let u = await User.get("test");
    //         expect(u.last_login_at).toBe(null);

    //         User.updateLoginTimestamp("test");
    //         let u2 = await User.get("test");
    //         expect(u2.last_login_at).not.toBe(null);
    //     });

    //     test("can get", async function() {
    //         let u = await User.get("test");
    //         expect(u).toEqual({
    //             username: "test",
    //             first_name: "Test",
    //             last_name: "Testy",
    //             phone: "+14155550000",
    //             last_login_at: expect.any(Date),
    //             join_at: expect.any(Date),
    //         });
    //     });

    //     test("can get all", async function() {
    //         let u = await User.all();
    //         expect(u).toEqual([{
    //             username: "test",
    //             first_name: "Test",
    //             last_name: "Testy",
    //             phone: "+14155550000"
    //         }]);
    //     });
    // });

    // describe("Test messages part of User class", function() {
    //     beforeEach(async function() {
    //         await db.query("DELETE FROM messages");
    //         await db.query("DELETE FROM users");
    //         await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

    //         let u1 = await User.register({
    //             username: "test1",
    //             password: "password",
    //             first_name: "Test1",
    //             last_name: "Testy1",
    //             phone: "+14155550000",
    //         });
    //         let u2 = await User.register({
    //             username: "test2",
    //             password: "password",
    //             first_name: "Test2",
    //             last_name: "Testy2",
    //             phone: "+14155552222",
    //         });
    //         let m1 = await Message.create({
    //             from_username: "test1",
    //             to_username: "test2",
    //             body: "u1-to-u2"
    //         });
    //         let m2 = await Message.create({
    //             from_username: "test2",
    //             to_username: "test1",
    //             body: "u2-to-u1"
    //         });
    //     });

    //     test('can get messages from user', async function() {
    //         let m = await User.messagesFrom("test1");
    //         expect(m).toEqual([{
    //             id: expect.any(Number),
    //             body: "u1-to-u2",
    //             sent_at: expect.any(Date),
    //             read_at: null,
    //             to_user: {
    //                 username: "test2",
    //                 first_name: "Test2",
    //                 last_name: "Testy2",
    //                 phone: "+14155552222",
    //             }
    //         }]);
    //     });

    //     test('can get messages to user', async function() {
    //         let m = await User.messagesTo("test1");
    //         expect(m).toEqual([{
    //             id: expect.any(Number),
    //             body: "u2-to-u1",
    //             sent_at: expect.any(Date),
    //             read_at: null,
    //             from_user: {
    //                 username: "test2",
    //                 first_name: "Test2",
    //                 last_name: "Testy2",
    //                 phone: "+14155552222",
    //             }
    //         }]);
    //     });
    // });
});
afterAll(async function() {
    await db.end();
});