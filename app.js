import path from "path"; // Required to use views and public folders
import { fileURLToPath } from "url";

import express from "express";
import mongoose from "mongoose";
import expressEjsLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import cookieParser from "cookie-parser"; // Required to read refreshToken

import 'dotenv/config';
import jotRoutes from "./routes/jotRoutes.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";

// App init and path setup
const app = express();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine config
app.set("views", path.join(__dirname, "views")); // Define where views are located
app.set("view engine", "ejs"); 
app.set("layout", "layouts/template");
app.use(expressEjsLayouts);

// Static files and middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(methodOverride('_method')); // Required to look for DELETE method inside a POST request
app.use(express.urlencoded({ extended: true })); // had to add as post from ejs from was undefined. Research further
app.use(express.json()); // Provides ability to destructure JSON
app.use(rateLimitMiddleware); // Protect all routes with rate limiter

// Router config
app.use("/", jotRoutes);

// Fallback for all other routes
app.use((req,res) => {
    res.status(404).render("error/error", { message: "Resource not found." });
});

// Database connection and start server
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.error("Failed to connect to MongoDB: ", error);
});