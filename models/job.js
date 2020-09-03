const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Job {
    constructor(id, title, salary, equity, company_handle, date_posted) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.equity = equity;
        this.company_handle = company_handle;
        this.date_posted = date_posted
    }


    /** get all jobs: returns [job, ...] */

    static async getAll() {
        const result = await db.query(
            `SELECT * FROM jobs`);
        if (result.rows.length === 0) {
            throw new ExpressError("No jobs", 400)
        };
        return result.rows.map(j => new Job(j.id, j.title, j.salary, j.equity, j.company_handle, j.date_posted));
    }

    static async search(str = "", min = 0, equity = 0) {

        const result = await db.query(
            `SELECT * FROM jobs WHERE 
                (title ILIKE $1 OR company_handle ILIKE $1) AND salary >= $2 AND equity >= $3`, [`%${str}%`, min, equity]);
        if (result.rows.length === 0) {
            throw new ExpressError("no results", 400)
        };
        return result.rows.map(j => new Job(j.id, j.title, j.salary, j.equity, j.company_handle, j.date_posted));
    }

    /** get job by id: returns job */

    static async getById(id) {
        const result = await db.query(
            `SELECT * FROM jobs WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such job with id: ${id}`, 404);
        }

        let j = result.rows[0];
        return new Job(j.id, j.title, j.salary, j.equity, j.company_handle, j.date_posted);
    }

    /** create a job: returns job */

    static async create(title, salary, equity, company_handle) {
        try {
            const newJob = await db.query(`INSERT INTO jobs (title, salary, equity, company_handle) VALUES ($1, $2, $3, $4) RETURNING id, title, salary, equity, company_handle, date_posted`, [title, salary, equity, company_handle]);
            const j = newJob.rows[0];
            return new Job(j.id, j.title, j.salary, j.equity, j.company_handle, j.date_posted);
        } catch (e) {
            if (e.code == 23503) {
                throw new ExpressError(`Company with handle: ${company_handle} does not exists`, 400)
            }
            throw new Error("Something went wrong");
        }

    }

    /** save job to db */

    async save() {
        await db.query(
            `UPDATE jobs SET title=$1, salary=$2, equity=$3, company_handle=$4 WHERE id = $5`, [this.title, this.salary, this.equity, this.company_handle, this.id]);
    }

    /** delete job */

    async remove() {
        await db.query(
            `DELETE FROM jobs WHERE id = $1`, [this.id]);
    }
}


module.exports = Job;