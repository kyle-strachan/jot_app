import User from "../models/users.js";
import { signAccessToken, signRefreshToken } from "../middleware/auth.js";


export async function register(req, res) {
    console.log("Register route found");
    const { username, password } = req.body;
    try {
        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "Username already exists." });
        }
       
        const hashedPassword = await User.hashPassword(password);
        await User.create({
            username,
            passwordHash: hashedPassword
        });
        res.status(201).json({ message: "User successfully created, please log in."});

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "User already exists with this email." });
        }
        res.status(500).json({ error: error.message });
    }
}

export async function login(req, res) {
    // BUG: username in case matters!! convert all to lower case?
    console.log("Login route found");
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: "Invalid username" }) // TODO: Change later to be vague
    }
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid password." });
    }
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set secure flag in production
        sameSite: "Lax", // Mitigates CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days 
    });
    // res.status(200).json({ message: "Login successful", accessToken });
    res.redirect("/notes");
    // console.log("End of login route");
}

export async function logout(req, res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax"
    });
    res.redirect("/");
}