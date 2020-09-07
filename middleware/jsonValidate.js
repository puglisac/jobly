const ExpressError = require("../helpers/expressError");
const jsonschema = require("jsonschema");

function jsonValidate(schema) {
	return async function(req, res, next) {
		const isValid = await jsonschema.validate(req.body, schema);
		if (!isValid.valid) {
			let listOfErrors = isValid.errors.map((error) => error.stack);
			let error = new ExpressError(listOfErrors, 400);
			return next(error);
		}
		return next();
	};
}
module.exports = jsonValidate;
