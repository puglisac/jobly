const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const ExpressError = require("../helpers/expressError");

class User {
    constructor(username, first_name, last_name, email, photo_url, is_admin, jobs) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.photo_url = photo_url;
        this.is_admin = is_admin;
        this.jobs = jobs;
    }

    static async register(username, password, first_name, last_name, email, photo_url = null, is_admin = false) {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (
            username,
            password,
            first_name,
            last_name, 
            email, photo_url, is_admin)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING username, first_name, last_name, email, photo_url, is_admin`, [username, hashedPassword, first_name, last_name, email, photo_url, is_admin]
        );
        return result.rows[0];
    }

    /** Authenticate: is this username/password valid? Returns boolean. */

    static async authenticate(username, password) {
        const results = await db.query(
            `SELECT username, password 
       FROM users
       WHERE username = $1`, [username]
        );
        const user = results.rows[0];

        return await bcrypt.compare(password, user.password);
    }

    /** All: basic info on all users:
     * [{username, first_name, last_name, email}, ...] */

    static async all() {
        const users = await db.query(`SELECT username, first_name, last_name, email FROM users`);
        if (users.rows.length === 0) {
            throw new ExpressError("No users", 404);
        }
        return users.rows;
    }

    /** Get: get user by username **/

    static async get(username) {
        const user = await db.query(
            `
    SELECT u.username, first_name, last_name, email, photo_url, is_admin, a.job_id, a.state FROM users AS u FULL JOIN applications AS a ON a.username = u.username WHERE u.username = $1`, [username]
        );
        if (!user.rows[0]) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }
        const u = user.rows[0];
        const j = user.rows;
        const jobs = [];
        for (let job of j) {
            jobs.push({ job_id: job.job_id, state: job.state })
        }
        return new User(u.username, u.first_name, u.last_name, u.email, u.photo_url, u.is_admin, jobs);
    }
    async save() {
        await db.query(
            `UPDATE users SET first_name=$2, last_name=$3, email=$4, photo_url=$5, is_admin=$6 WHERE username = $1`, [this.username, this.first_name, this.last_name, this.email, this.photo_url, this.is_admin]);
    }
    async remove() {
        await db.query(
            `DELETE FROM users WHERE username = $1`, [this.username]);
    }
}

module.exports = User;