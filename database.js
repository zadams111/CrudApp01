import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config();


//sql pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();


export async function getUsers(){
    const [result] = await pool.query("SELECT * FROM users");
    return result;
}

//Get a user with a specific ID
export async function getUser(user_id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM users 
        WHERE user_id = ?`, [user_id]);
    return rows[0];
}


//add the user to the database
export async function createUser(user_name, email, password, phone_number, profile_picture){
    
    const password_hash = await bcrypt.hash(password, 10);
    
    
    const [user] = await pool.query(`INSERT INTO users (
        user_name, email, password, phone_number, profile_picture)
        VALUES (?, ?, ?, ?, ?)`, [user_name, email, password_hash, phone_number, profile_picture]);
    
    const user_id = user.insertId;
    return getUsers(user_id);
}

//Updates the user using the primary key user_id
export async function updateUser(user_id, user_name, email, phone_number) {
    try {
        // Update user_name
        await pool.query(
            `UPDATE users 
             SET user_name = ?, email = ?, phone_number = ? 
             WHERE user_id = ?`, 
            [user_name, email, phone_number, user_id]
        );
        
        
        
        
        console.log(`User with ID ${user_id} updated successfully.`);

    } catch (error) {
        // Check if the error is a unique constraint violation
        if (error.code === 'ER_DUP_ENTRY') { // MySQL/MariaDB specific error code
            console.error('Error: The user_name already exists.');
            throw new Error('This username is already taken. Please choose a different one.');
        } else {
            // For other errors, rethrow them
            console.error('Error updating user:', error);
            throw error;
        }
    }
}

export async function deleteUser(user_id){
    
    await pool.query(`DELETE FROM users WHERE user_id = ?`, [user_id])


}