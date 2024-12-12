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


export async function updateUser(){
    console.log('Updated User Data')

}