import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import { errorHandler } from "./middlewares/errorHandler.js";
import taskRoutes from './routes/taskRoutes.js'
import cookieParser from "cookie-parser";
import http from "http"; 
import { WebSocketServer } from "ws"; 
import passport from "./config/passport.js"; 
import session from "express-session"; // Use express-session instead
import MongoStore from "connect-mongo";


// config
dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// MongoDB Connection
connectDB()
const allowedOrigins = process.env.FRONTEND?.split(",");
// Middleware
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || "yourSecret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // Use your actual MongoDB URI
            collectionName: "sessions",
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            httpOnly: true,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/api/auth",authRoutes)
app.use("/api/tasks",taskRoutes)

// get file data display or download
app.use('/uploads', express.static('uploads'));

// WebSocket Connection Handling
wss.on("connection", (ws) => {
    console.log("Client connected 🟢");

    ws.on("message", (message) => {
        console.log("Message from client:", message);
    });

    ws.on("close", () => console.log("Client disconnected 🔴"));
});

// Function to broadcast updates
export const broadcastUpdate = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(message));
        }
    });
};


// error Handler
app.use(errorHandler);
// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`WebSocket server running on ws://localhost:${PORT}`));

