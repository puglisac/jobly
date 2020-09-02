const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Company {
    constructor(handle, name, num_employees, description, logo_url, jobs) {
        this.handle = handle;
        this.name = name;
        this.num_employees = num_employees;
        this.description = description;
        this.logo_url = logo_url;
        this.jobs = jobs;
    }


    /** get all companies: returns [company, ...] */

    static async getAll() {
        const result = await db.query(
            `SELECT * FROM companies`);
        if (result.rows.length === 0) {
            throw new ExpressError("No companies", 400)
        };
        return result.rows.map(c => new Company(c.handle, c.name, c.num_employees, c.description, c.logo_url));
    }

    static async search(str = "", min = 0, max = Math.pow(2, 31) - 1) {
        if (max < min) {
            throw new ExpressError("max_employees cannot be less than min_employees", 400);
        }
        const result = await db.query(
            `SELECT * FROM companies WHERE 
                (handle ILIKE $1 OR name ILIKE $1) AND (num_employees BETWEEN $2 AND $3)`, [`%${str}%`, min, max]);
        if (result.rows.length === 0) {
            throw new ExpressError("no results", 400)
        };
        return result.rows.map(c => new Company(c.handle, c.name, c.num_employees, c.description, c.logo_url));
    }

    /** get company by handle: returns company */

    static async getById(handle) {
        const result = await db.query(
            `SELECT * FROM companies FULL JOIN jobs ON handle = company_handle WHERE handle = $1`, [handle]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${handle}`, 404);
        }

        let c = result.rows[0];
        const jobs = [];
        if (c.title) {
            for (let j of result.rows) {
                jobs.push({ id: j.id, title: j.title, salary: j.salary, equity: j.equity, date_posted: j.date_posted });
            }
        }
        return new Company(c.handle, c.name, c.num_employees, c.description, c.logo_url, jobs);
    }

    /** create a company: returns company */

    static async create(handle, name, num_employees, description, logo_url) {
        try {
            await db.query(`INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ($1, $2, $3, $4, $5)`, [handle, name, num_employees, description, logo_url]);
        } catch (e) {
            if (e.code == 23505) {
                throw new ExpressError(`Company with handle: ${handle} already exists`, 400)
            }
            throw new Error("Something went wrong");
        }
        return new Company(handle, name, num_employees, description, logo_url);

    }

    /** save company to db */

    async save() {
        await db.query(
            `UPDATE companies SET name=$1, num_employees=$2, description=$3, logo_url=$4  WHERE handle = $5`, [this.name, this.num_employees, this.description, this.logo_url, this.handle]);
    }

    /** delete company */

    async remove() {
        await db.query(
            `DELETE FROM companies WHERE handle = $1`, [this.handle]);
    }
}


module.exports = Company;