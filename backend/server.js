import express from 'express';
import authRoute from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();

const app = express();
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