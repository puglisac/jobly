const db = require("../../db");
const User = require("../../models/user");

describe("Test user class", function() {

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

    });
    test("can get all users", async function() {
        let u = await User.all()

        expect(u).toEqual([{
            "username": "testing",
            "first_name": "test",
            "last_name": "user",
            "email": "test@test.com"
        }]);
    });

    test("can register a user", async function() {
        let u = await User.register(
            "testuser",
            "123",
            "test",
            "user",
            "test.user@test.com",
            "https://testurl.com/testimg.jpg"
        );

        expect(u).toEqual({
            "username": "testuser",
            "first_name": "test",
            "last_name": "user",
            "email": "test.user@test.com",
            "photo_url": "https://testurl.com/testimg.jpg",
            "is_admin": false
        });
    });
    test("can get user by username", async function() {
        let u = await User.get("testing");

        expect(u.username).toEqual("testing");
    });

});
afterAll(async function() {
    await db.end();
});