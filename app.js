import express from "express";
import path from "path"; // Required to use views and public folders
import { fileURLToPath } from "url";
import expressEjsLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import 'dotenv/config';
import jotRoutes from "./routes/jotRoutes.js";
import methodOverride from "method-override";
import cookieParser from "cookie-parser"; // Required to read refreshToken

const app = express();
const PORT = process.env.PORT //|| 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// App config
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Next bit is required to look for DELETE method inside a POST request
app.use(methodOverride('_method'));

// View engine config
app.set("view engine", "ejs");
app.set("layout", "layouts/main");


// Middleware config
app.use(expressEjsLayouts);
app.use(express.urlencoded({ extended: true })); // had to add as post from ejs from was undefined. Research further
app.use(express.json()); // Provides ability to destructure JSON

// app.get("/", (req, res) => {
//     res.render("index", { title: "JOT HOME", sampleMessage: "Sample Message"});
// })

// Router config
app.use("/", jotRoutes);

// Database connection
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