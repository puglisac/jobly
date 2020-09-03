const express = require("express");
const jsonschema = require("jsonschema");
const Company = require("../models/company");
const companySchema = require("../schema/companySchema.json");
const updateCompanySchema = require("../schema/updateCompanySchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");


router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {

        if (Object.keys(req.query).length != 0) {
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
            return res.json({ companies: companies });
        }
        let companies = await Company.getAll();
        return res.json({ companies: companies });
    } catch (e) {
        return next(e)
    }

});

/** get company by handle */

router.get("/:handle", ensureLoggedIn, async function(req, res, next) {
    try {
        let company = await Company.getById(req.params.handle);
        return res.json({ company: company });
    } catch (e) {
        return next(e);
    }

});

/** create company */

router.post("/", ensureAdmin, async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, companySchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    try {
        let newCompany = await Company.create(req.body.handle, req.body.name, req.body.num_employees, req.body.description, req.body.logo_url);
        return res.status(201).json({ company: newCompany });
    } catch (e) {

        return next(e)
    }

});

/** delete company from {handle}; returns "deleted" */

router.delete("/:handle", ensureAdmin, async function(req, res, next) {
    try {
        let company = await Company.getById(req.params.handle);
        await company.remove();
        return res.json({ message: "company deleted" });
    } catch (e) {
        return next(e)
    }

});


/** updates a company */

router.patch("/:handle", ensureAdmin, async function(req, res, next) {
    const isValid = await jsonschema.validate(req.body, updateCompanySchema);
    if (!isValid.valid) {
        let listOfErrors = isValid.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    try {
        let company = await Company.getById(req.params.handle);
        for (key in req.body) {
            if (key != 'handle') {
                company[key] = req.body[key];
            }
        }
        company.save();
        const savedCompany = await Company.getById(req.params.handle);
        return res.json({ company: savedCompany });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;