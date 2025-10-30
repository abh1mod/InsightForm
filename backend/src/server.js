import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express"
import http from "http";
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";
import cors from "cors";
import { Server } from 'socket.io';
import { connectDB } from "./services/db.js";
const app = express();
app.set("trust proxy", 1);
// Tell Express to trust proxy headers (important for hosted environments)

const server = http.createServer(app);

const allowedOrigins = [
    "https://www.insightform.live",
    "https://insightform.live",
    "https://insightform.netlify.app",
    "http://localhost:5000"
];

const io = new Server(server, { // Attach Socket.IO to the HTTP server
    cors: {
        origin: allowedOrigins, // Allow your frontend
        methods: ["GET", "POST"]
    }
});


app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

// --- Socket.IO Authentication Middleware ---
io.use(async (socket, next) => {
    // Get token from handshake data
    const token = socket.handshake.auth.token;

    try {
        if (!token) {
            console.log(`Auth Middleware: No token provided by socket ${socket.id}`);
            return next(new Error('Authentication error: No token provided.'));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Check if user exists (optional but good practice)
        const user = await User.findById(decoded.id).select('_id');
        if (!user) {
            console.log(`Auth Middleware: User ${decoded.id} not found for socket ${socket.id}`);
            return next(new Error('Authentication error: User not found.'));
        }

        // --- Authentication Successful ---
        console.log(`Auth Middleware: User ${user._id} authenticated for socket ${socket.id}`);
        // Attach user ID to the socket object for later use
        socket.userId = user._id.toString();
        next(); // Proceed to establish the connection

    } catch (error) { // Catches JWT errors (invalid, expired)
        console.error(`Auth Middleware Error for socket ${socket.id}:`, error.message);
        next(new Error('Authentication error: Invalid token.')); // Reject connection
    }
});

io.on('connection', (socket) => {
    // By the time this runs, the middleware has already authenticated the user
    console.log(`Socket connected: ${socket.id}, User ID: ${socket.userId}`);

    // Add user to the connected map
    if (socket.userId) {
        socket.join(socket.userId); // Join a room named after the user ID
    }
    
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

//method to connect to the database
connectDB();

app.use(express.json()); // body parser 

app.use((req, res, next) => {
    req.io = io; // Attach the main Socket.IO server instance
    next();
});

app.use("/api/auth",authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/response", responseRoutes);
app.use("/api/report", reportRoutes);   
app.use("/api/notification", notificationRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({ sucess: false, message: "Internal Server Error" }); // Send a generic error response
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log(`Server Running On Port ${PORT}`);
});
