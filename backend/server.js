import express from 'express';
import authRoute from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();

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

app.listen(PORT, () =>{
    console.log(`Server is running at PORT ${PORT}`);
    connectMongoDB();
})