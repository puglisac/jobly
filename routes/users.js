const express = require("express");
const jsonValidate = require("../middleware/jsonValidate");
const User = require("../models/user");
const updateUserSchema = require("../schema/updateUserSchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

router.get("/", async function(req, res, next) {
	try {
		const allUsers = await User.all();
		return res.json({ users: allUsers });
	} catch (e) {
		return next(e);
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

/** delete user from {username}; returns "deleted" */

router.delete("/:username", ensureCorrectUser, async function(req, res, next) {
	try {
		let user = await User.get(req.params.username);
		await user.remove();
		return res.json({ message: "user deleted" });
	} catch (e) {
		return next(e);
	}
});

/** updates a job */

router.patch("/:username", ensureCorrectUser, jsonValidate(updateUserSchema), async function(req, res, next) {
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
});

module.exports = router;
