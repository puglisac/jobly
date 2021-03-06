/** Express app for jobly. */

const express = require("express");

const ExpressError = require("./helpers/expressError");
const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");
const companyRoutes = require("./routes/companies")
const jobRoutes = require("./routes/jobs")
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const app = express();

app.use(express.json());

// add logging system
app.use(morgan("tiny"));

// get auth token for all routes
app.use(authenticateJWT);

// routes
app.use(authRoutes);
app.use("/companies", companyRoutes);
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);

/** 404 handler */
app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);

    // pass the error to the next piece of middleware
    return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);

    return res.json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;