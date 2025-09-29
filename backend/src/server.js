import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express"
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import cors from "cors";
import {connectDB} from "./services/db.js";
const app = express();


app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5000"],
  })
);

//method to connect to the database
connectDB();

app.use(express.json()); // body parser 

app.use("/api/auth",authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/response", responseRoutes);
app.use("/api/report", reportRoutes);   

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({ sucess: false, message: "Internal Server Error" }); // Send a generic error response
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server Running On Port ${PORT}`);
});
