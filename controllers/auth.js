import User from "../models/users.js";
import { signAccessToken, signRefreshToken } from "../middleware/auth.js";

const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;
const REGEX_USERNAME = /^[a-zA-Z0-9_]+$/;
const REGEX_PASSWORD = /^[a-zA-Z0-9!@#$%^&*()]+$/;

export async function register(req, res) {
    // console.log("Register route found");
    let { username, password } = req.body;

    username = username.trim().toLowerCase();
    password = password.trim();

    if (!REGEX_USERNAME.test(username)) {
        res.render("index", {
            title: "Registration error",
            uiMessages: { register: `Registration failed: a username may only contain alphanumeric characters and underscores.` }
        });
        return;
    }

    if (username.length < USERNAME_MIN_LENGTH) {
        res.render("index", {
            title: "Registration error",
            uiMessages: { register: `Registration failed: a username must be a minimum of ${USERNAME_MIN_LENGTH} characters long.` }
        });
        return;
    }

    if (!REGEX_PASSWORD.test(password)) {
        res.render("index", {
            title: "Registration error",
            uiMessages: { register: `Registration failed: a password may only contain the following characters: A-Z, a-z, 0-9, !, @, #, $, %, ^, &, *, (, )` }
        });
        return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        res.render("index", {
            title: "Registration error",
            uiMessages: { register: `Registration failed: a password must be a minimum of ${PASSWORD_MIN_LENGTH} characters long.` }
        });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.render("index", {
            title: "Login error",
            uiMessages: { register: "Username already exists, please choose another." }
        });
        return;
        // return res.status(409).json({ error: "Username already exists." });
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
    let { username, password } = req.body;
    
    // Register forces lowercase username, login forces to match
    username = username.trim().toLowerCase();
    password = password.trim();
    
    const user = await User.findOne({ username });
    if (!user) {
        res.render("index", {
            title: "Login error",
            uiMessages: { login: "Invalid login credentials, please try again." }
        });
        return; //res.status(401).json({ error: "Invalid username" }) // TODO: Change later to be vague
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