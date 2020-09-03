const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const userSchema = require("../schema/userSchema.json");
const jwt = require("jsonwebtoken");
const ExpressError = require("../helpers/expressError");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.get(username);

        if (user) {
            if (await User.authenticate(username, password)) {
                let token = jwt.sign({ username }, SECRET_KEY);
                return res.json({ token });
            }
        }
        throw new ExpressError("Invalid user/password", 400);
    } catch (err) {
        return next(err);
    }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/users", async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, userSchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    try {
        const { username, password, first_name, last_name, email, photo_url, is_admin } = req.body;
        await User.register(username, password, first_name, last_name, email, photo_url, is_admin);
        let token = jwt.sign({ username }, SECRET_KEY);
        return res.status(201).json({ token });
    } catch (err) {
        if (err.code === "23505") {
            return next(new ExpressError("Username taken. Please pick another!", 400));
        }
        return next(err);
    }
});
module.exports = router;