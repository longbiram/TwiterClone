import express from 'express';
import authRoute from './routes/auth.routes.js';
import postRoute from './routes/post.routes.js';
import notificationRoute from './routes/notification.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/users.routes.js';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const PORT = process.env.PORT || 8000

console.log(process.env.MONGO_DB_URI);

app.get("/",(req,res) => {
    res.send("Server is ready");
})

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);

app.listen(PORT, () =>{
    console.log(`Server is running at PORT ${PORT}`);
    connectMongoDB();
})