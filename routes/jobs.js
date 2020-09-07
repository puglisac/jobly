const express = require("express");
const Job = require("../models/job");
const Application = require("../models/application");
const jsonValidate = require("../middleware/jsonValidate");
const jobSchema = require("../schema/jobSchema.json");
const updateJobSchema = require("../schema/updateJobSchema.json");
const applySchema = require("../schema/appSchema.json");
const updateApplySchema = require("../schema/updateAppSchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

router.get("/", ensureLoggedIn, async function(req, res, next) {
	try {
		if (Object.keys(req.query).length != 0) {
			const { search, min_salary, min_equity } = req.query;
			let jobs = await Job.search(search, min_salary, min_equity);
			return res.json({ jobs: jobs });
		}
		let jobs = await Job.getAll();
		return res.json({ jobs: jobs });
	} catch (e) {
		return next(e);
	}
});

/** get job by id */

router.get("/:id", ensureLoggedIn, async function(req, res, next) {
	try {
		let job = await Job.getById(req.params.id);
		return res.json({ job: job });
	} catch (e) {
		return next(e);
	}
});

/** create job */

router.post("/", ensureAdmin, jsonValidate(jobSchema), async function(req, res, next) {
	try {
		let newJob = await Job.create(req.body.title, req.body.salary, req.body.equity, req.body.company_handle);
		return res.status(201).json({ job: newJob });
	} catch (e) {
		return next(e);
	}
});

/** delete job from {id}; returns "deleted" */

router.delete("/:id", ensureAdmin, async function(req, res, next) {
	try {
		let job = await Job.getById(req.params.id);
		await job.remove();
		return res.json({ message: "job deleted" });
	} catch (e) {
		return next(e);
	}
});

/** updates a job */

router.patch("/:id", ensureAdmin, jsonValidate(updateJobSchema), async function(req, res, next) {
	try {
		let job = await Job.getById(req.params.id);
		for (key in req.body) {
			job[key] = req.body[key];
		}
		job.save();
		const savedJob = await Job.getById(req.params.id);
		return res.json({ job: savedJob });
	} catch (e) {
		return next(e);
	}
});
// apply to a job
router.post("/:id/apply", ensureLoggedIn, jsonValidate(applySchema), async function(req, res, next) {
	try {
		let apply = await Application.create(req.user.username, req.params.id, req.body.state);
		return res.status(201).json({ message: apply });
	} catch (e) {
		return next(e);
	}
});
router.patch("/:id/apply", ensureAdmin, jsonValidate(updateApplySchema), async function(req, res, next) {
	try {
		let apply = await Application.changeState(req.body.username, req.params.id, req.body.state);
		return res.json({ message: apply });
	} catch (e) {
		return next(e);
	}
});
module.exports = router;
