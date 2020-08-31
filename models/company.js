const db = require("../db");

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

    /** get dog by id: returns dog */

    static async getById(handle) {
        const result = await db.query(
            `SELECT * FROM companies WHERE handle = $1`, [handle]);
        if (result.rows.length === 0) {
            throw new Error(`No such company: ${handle}`);
        }

        let c = result.rows[0];
        return new Company(c.handle, c.name, c.num_employes, c.description, c.logo_url);
    }

    /** create a dog: returns dog */

    static async create(name, age) {
        const result = await db.query(
            `INSERT INTO dogs (name, age)
        VALUES ($1, $2) RETURNING id`, [name, age]);

        let { id } = result.rows[0];
        return new Dog(id, name, age);
    }

    /** save dog to db */

    async save() {
        await db.query(
            `UPDATE dogs SET name=$1, age=$2 WHERE id = $3`, [this.name, this.age, this.id]);
    }

    /** delete dog */

    async remove() {
        await db.query(
            `DELETE FROM dogs WHERE id = $1`, [this.id]);
    }
}


module.exports = Company;