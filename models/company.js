const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Company {
    constructor(handle, name, num_employees, description, logo_url) {
        this.handle = handle;
        this.name = name;
        this.num_employees = num_employees;
        this.description = description;
        this.logo_url = logo_url
    }


    /** get all companies: returns [company, ...] */

    static async getAll() {
        const result = await db.query(
            `SELECT * FROM companies`);
        return result.rows.map(c => new Company(c.handle, c.name, c.num_employes, c.description, c.logo_url));
    }

    static async search(str = "", min = 0, max = Math.pow(2, 31) - 1) {
            console.log(max);
            if (max < min) {
                return new ExpressError("max_employees cannot be less than min_employees", 400);
            }
            const result = await db.query(
                `SELECT * FROM companies WHERE 
                (handle ILIKE $1 OR name ILIKE $1) AND (num_employees BETWEEN $2 AND $3)`, [`%${str}%`, min, max]);
            if (result.rows.length === 0) {
                return new ExpressError("no results", 400)
            };
            return result.rows.map(c => new Company(c.handle, c.name, c.num_employees, c.description, c.logo_url));
        }
        // static async searchEmp(max = Infinity, min = 0) {
        //     const result = await db.query(
        //         `SELECT * FROM companies WHERE num_employees BETWEEN $1 and $2`, [min, max]);
        //     return result.rows.map(c => new Company(c.handle, c.name, c.num_employes, c.description, c.logo_url));
        // }

    /** get company by handle: returns company */

    static async getById(handle) {
        const result = await db.query(
            `SELECT * FROM companies WHERE handle = $1`, [handle]);
        if (result.rows.length === 0) {
            throw new Error(`No such company: ${handle}`);
        }

        let c = result.rows[0];
        return new Company(c.handle, c.name, c.num_employees, c.description, c.logo_url);
    }

    /** create a company: returns company */

    static async create(handle, name, num_employees, description, logo_url) {

        await db.query(`INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ($1, $2, $3, $4, $5)`, [handle, name, num_employees, description, logo_url]);
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