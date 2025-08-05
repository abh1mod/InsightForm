import express, { json } from "express"
import appRoutes from "./routes/appRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv"
const app = express();
dotenv.config();


app.use(express.json()); // body parser 

app.use("/api",appRoutes);
connectDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server Running On Port ${PORT}`);
});
