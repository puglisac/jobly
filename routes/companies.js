const express = require("express");
const jsonschema = require("jsonschema");
const Company = require("../models/company");
const companySchema = require("../schema/companySchema.json");
const updateCompanySchema = require("../schema/updateCompanySchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");


router.get("/", async function(req, res, next) {
    try {
        if (req.query) {
            const r = req.query;
            let search, min, max;
            if (r.search) {
                search = r.search;
            }
            if (r.min_employees) {
                min = r.min_employees;
            }
            if (r.max_employees) {
                max = r.max_employees
            }
            let companies = await Company.search(search, min, max);
            return res.json(companies);
        }
        let companies = await Company.getAll();
        return res.json(companies);
    } catch (e) {
        return next(e)
    }

});

/** get company by handle */

router.get("/:handle", async function(req, res, next) {
    try {
        let company = await Company.getById(req.params.handle);
        return res.json(company);
    } catch (e) {
        return next(e);
    }

});

/** create company */

router.post("/", async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, companySchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    if (await Company.getById(req.body.handle)) {
        const e = new ExpressError(`Company with handle ${req.body.handle} already exists`, 400)
        return next(e);
    }
    try {
        let newCompany = await Company.create(req.body.handle, req.body.name, req.body.num_employees, req.body.description, req.body.logo_url);
        return res.json(newCompany);
    } catch (e) {

        return next(e)
    }

});

/** delete company from {handle}; returns "deleted" */

router.delete("/:handle", async function(req, res, next) {
    try {
        let company = await Company.getById(req.params.handle);
        await company.remove();
        return res.json("deleted");
    } catch (e) {
        return next(e)
    }

});


/** age dog: returns new age */

router.patch("/:handle", async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, companySchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    try {
        let company = await Company.getById(req.params.handle);
        console.log(req.body)
        for (key in req.body) {
            if (key != 'handle') {
                company[key] = req.body[key];
            }
        }
        company.save();
        const savedCompany = await Company.getById(req.params.handle);
        return res.json(savedCompany);
    } catch (e) {
        return next(e);
    }
})

module.exports = router;