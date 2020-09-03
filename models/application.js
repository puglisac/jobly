const db = require("../db");
const ExpressError = require("../helpers/expressError");
class Application {

    static async create(username, job_id, state) {
        const result = await db.query(
            `INSERT INTO applications (
            username,
            job_id,
            state)
          VALUES ($1, $2, $3)
          RETURNING state`, [username, job_id, state]
        );
        return result.rows[0];
    }
    static async changeState(username, id, state) {
        const result = await db.query(`UPDATE applications 
        SET state=$1 WHERE job_id=$2 AND username=$3 RETURNING state`, [state, id, username]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No application found`, 404);
        }
        return result.rows[0];
    }
}
module.exports = Application;