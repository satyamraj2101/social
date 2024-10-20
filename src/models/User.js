// models/User.js
const pool = require('../config/db');

class User {
    static async createUser({ username, email, securityQuestion, securityAnswer, password }) {
        const query = `
            INSERT INTO users (username, email, security_question, security_answer, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`;
        const values = [username, email, securityQuestion, securityAnswer, password];
        const res = await pool.query(query, values);
        return res.rows[0];
    }

    static async findUserByUsernameOrEmail(usernameOrEmail) {
        const query = `
            SELECT * FROM users WHERE username = $1 OR email = $1`;
        const res = await pool.query(query, [usernameOrEmail]);
        return res.rows[0];
    }

    static async updatePassword(id, newPassword) {
        const query = `
            UPDATE users SET password = $1 WHERE id = $2`;
        await pool.query(query, [newPassword, id]);
    }
}

module.exports = User;
