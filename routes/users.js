const express = require("express");
const jsonschema = require("jsonschema");
const User = require("../models/user");
const updateUserSchema = require("../schema/updateUserSchema.json")
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");


router.get("/", async function(req, res, next) {
    try {
        const allUsers = await User.all();
        return res.json({ users: allUsers })
    } catch (e) {
        return next(e)
    }

});

/** get job by id */

router.get("/:username", async function(req, res, next) {
    try {
        let user = await User.get(req.params.username);
        return res.json({ user: user });
    } catch (e) {
        return next(e);
    }

});

/** create user */

// router.post("/", async function(req, res, next) {
//     const isValid = await jsonschema.validate(req.body, userSchema);
//     if (!isValid.valid) {
//         let listOfErrors = isValid.errors.map(error => error.stack);
//         let error = new ExpressError(listOfErrors, 400);
//         return next(error);
//     }
//     try {
//         let newUser = await User.register(req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.email, req.body.photo_url, req.body.is_admin);
//         return res.status(201).json({ user: newUser });
//     } catch (e) {

//         return next(e)
//     }

// });

/** delete user from {username}; returns "deleted" */

router.delete("/:username", ensureCorrectUser, async function(req, res, next) {
    try {
        let user = await User.get(req.params.username);
        await user.remove();
        return res.json({ message: "user deleted" });
    } catch (e) {
        return next(e)
    }

});


/** updates a job */

router.patch("/:username", ensureCorrectUser, async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, updateUserSchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    try {
        let user = await User.get(req.params.username);
        for (key in req.body) {
            user[key] = req.body[key];
        }
        user.save();
        const savedUser = await User.get(req.params.username);
        return res.json({ user: savedUser });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;