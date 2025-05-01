const {db} = require('../config/dbConnection');
const getAllUser = async () => {
    const { rows } = await db.query('SELECT * FROM users');
    return rows;
};


const getSingleUser = async (id) => {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
};


const updateUser = async (id, { name, email, phone, age, dept }) => {
    try {
        const { rows } = await db.query(
            'UPDATE users SET name = $1, email = $2, phone = $3, age = $4, dept = $5 WHERE id = $6 RETURNING *',
            [name, email, phone, age, dept, id]
        );

        return rows[0];

    } catch (error) {
        console.error('Update error:', error.message);
        throw error;
    }
};


const createUser = async ({ name, email, phone, age, dept }) => {
    try {
        const { rows } = await db.query(
            'INSERT INTO users (name, email, phone, age, dept) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, phone, age, dept]
        );
        return rows[0];
    } catch (error) {
        console.error('Insert error:', error.message);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const { rows } = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return rows[0];
    } catch (error) {
        console.error('Delete error:', error.message);
        throw error;
    }
};


let findUserByEmail = async({email}) => {

    let {rows} = await db.query('SELECT * FROM users WHERE email = $1', [email])
    return rows[0]
}




module.exports = { getAllUser, getSingleUser, updateUser, deleteUser, createUser, findUserByEmail };
