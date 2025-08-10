import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import testRoutes from "./routes/test.route.js"; 
import { connectDB } from "./db/connectDB.js";
import profileRoutes from "./routes/profile.route.js";
import authRoutes from "./routes/auth.route.js";
import sessionRoutes from "./routes/session.route.js";
import contactRoutes from "./routes/contact.route.js";	
import exploreRoutes from "./routes/explore.route.js";
import paymentRoutes from "./routes/payment.route.js"; 
import studentRoutes from "./routes/student.route.js";
import mentorRoutes from "./routes/mentor.route.js";
import { startSessionCompletionJob } from "./services/cron.service.js";
import chatRoutes from "./routes/chat.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser()); 

// ... app setup
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/sessions", sessionRoutes); 
app.use("/api/contact", contactRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/student", studentRoutes); 
app.use("/api/mentor", mentorRoutes); 
app.use("/api/chat", chatRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();    
	startSessionCompletionJob();
	console.log("Server is running on port: ", PORT);
});
