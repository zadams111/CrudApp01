import express from "express";
import router from './routes/routes.js'

import { getUsers} from "./database.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")


// Route Prefix
app.use("", router);
app.use('/uploads', express.static('uploads'));


app.listen(3000);





//name String required, email string, password string Required, phone type string required, image type string, created type = date required default date.now



