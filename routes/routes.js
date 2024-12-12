import express from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser} from '../database.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import bcrypt from 'bcrypt'

const router = express.Router();

// Ensure upload directory exists

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Route to display home page
router.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display add user form
router.get('/add', (req, res) => {
    res.render('user_add', { title: 'Add Users' });
});

// Route to handle form submission
router.post('/add', upload.single('profile_picture'), async (req, res) => {
    try {
        const { user_name, email, password, phone_number } = req.body;
        const image = req.file?.filename;

        await createUser(user_name, email, password, phone_number, image);

        res.redirect('/');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

//edit account page
router.get('/edit/:user_id', async (req, res) =>{ 
    let {user_id} = req.params
    const user = await getUser(user_id);

    //do error handling here

    res.render('edit_user', {
        title: "Edit User", 
        user: user,
    });
})

//update the user account data
router.post('/update/:user_id', upload.single('profile_picture'), async (req, res) => {

    const {user_id} = req.params;
    let new_image = '';
    
    //get the data from the req body
    const { user_name, email, password, phone_number } = req.body;

    if(req.file){
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./uploads/" + req.body.old_profile_picture)
        } catch(err) {
            console.log(err)
        }
        //update the file
    } else {

        //if there is no new image use the old profile picture
        new_image = req.body.old_profile_picture;
    }

    //update the user with the specified user_id
    await updateUser(user_id, user_name, email, phone_number)


    res.redirect('/');
});



//delete user
router.get('/delete/:user_id', (req, res) =>{

    const {user_id} = req.params;
    deleteUser(user_id);

    res.redirect('/');

})


export default router;
