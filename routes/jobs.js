const express = require("express");
const jsonschema = require("jsonschema");
const Job = require("../models/job");
const jobSchema = require("../schema/jobSchema.json");
// const updateCompanySchema = require("../schema/updateCompanySchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");


router.get("/", async function(req, res, next) {
    console.log(req.query)
    try {

        if (Object.keys(req.query).length != 0) {
            const r = req.query;

            let search, min, max;
            if (r.search) {
                search = r.search;
            }
            if (r.min_salary) {
                min = r.min_salary;
            }
            if (r.max_salary) {
                max = r.max_salary;
            }
            let jobs = await Job.search(search, min, max);
            return res.json({ jobs: jobs });
        }
        let jobs = await Job.getAll();
        return res.json({ jobs: jobs });
    } catch (e) {
        return next(e)
    }

});

/** get job by id */

router.get("/:id", async function(req, res, next) {
    try {
        let job = await Job.getById(req.params.id);
        return res.json({ job: job });
    } catch (e) {
        return next(e);
    }

});

/** create company */

router.post("/", async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, jobSchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    try {
        let newJob = await Job.create(req.body.title, req.body.salary, req.body.equity, req.body.company_handle);
        return res.status(201).json({ job: newJob });
    } catch (e) {

        return next(e)
    }

});

/** delete company from {handle}; returns "deleted" */

router.delete("/:id", async function(req, res, next) {
    try {
        let job = await Job.getById(req.params.id);
        await job.remove();
        return res.json({ message: "job deleted" });
    } catch (e) {
        return next(e)
    }

});


/** age dog: returns new age */

router.patch("/:id", async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, jobSchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
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
})

module.exports = router;