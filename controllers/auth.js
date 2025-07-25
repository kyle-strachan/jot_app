import User from "../models/users.js";
import { signAccessToken, signRefreshToken } from "../middleware/auth.js";

// Define username and password contraints
const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;
const REGEX_USERNAME = /^[a-zA-Z0-9_]+$/;
const REGEX_PASSWORD = /^[a-zA-Z0-9!@#$%^&*()]+$/;

export async function register(req, res) {

    // 1. Santize and test inputs
    let { username, password } = req.body;
    username = username.trim().toLowerCase(); // To prevent 'User' and 'user' mismatch
    password = password.trim();

    // Test username against selected characters, reject if invalid
    if (!REGEX_USERNAME.test(username)) {
        res.render("index", {
            uiMessages: { register: `Registration failed: a username may only contain alphanumeric characters and underscores.` }
        });
        return;
    }

    // Test username against minimum length, reject if too short
    if (username.length < USERNAME_MIN_LENGTH) {
        res.render("index", {
            uiMessages: { register: `Registration failed: a username must be a minimum of ${USERNAME_MIN_LENGTH} characters long.` }
        });
        return;
    }

    // Test password against selected characters, reject if invalid
    if (!REGEX_PASSWORD.test(password)) {
        res.render("index", {
            uiMessages: { register: `Registration failed: a password may only contain the following characters: A-Z, a-z, 0-9, !, @, #, $, %, ^, &, *, (, )` }
        });
        return;
    }

    // Test password against minimum length, reject if too short
    if (password.length < PASSWORD_MIN_LENGTH) {
        res.render("index", {
            uiMessages: { register: `Registration failed: a password must be a minimum of ${PASSWORD_MIN_LENGTH} characters long.` }
        });
        return;
    }

    // 2. Attempt to insert new user in db
    try {
        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.render("index", {
            uiMessages: { register: "Username already exists, please choose another." }
            });
            return;
        }
        
        // Hash password
        const hashedPassword = await User.hashPassword(password);
        await User.create({
            username,
            passwordHash: hashedPassword
        });
        // Chose to take user directly to notes after successful registration, instead of logging in.
        login(req, res);

    } catch (error) {
        if (error.code === 11000) {
            // Although should be caught in existingUser checks, it possible for an entry to be momentarily in between. Kept in code.
            res.render("index", {
            uiMessages: { register: "Username already exists, please choose another." }
            });
            return;
        }
        // General server error
        res.render("index", {
            uiMessages: { register: "Unable to create a new user at this time, please try again later." }
            });
            return;
    }
}

export async function login(req, res) {
    
    try {
        // During testing I found an abandoned session could be recovered when switching between users.
        // This forces a logout before proceeding with new login.
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax"
        });
    
        let { username, password } = req.body;
        
        // Register forces lowercase username, login forced to match
        username = username.trim().toLowerCase();
        password = password.trim();
        
        const user = await User.findOne({ username });
        // Test if user exists, reject if not. Chose to not specify which credential is incorrect in UI.
        if (!user) {
            res.render("index", {
                uiMessages: { login: "Invalid login credentials, please try again." }
            });
            return;
        }
    
        const isValidPassword = await user.isValidPassword(password);
        // Test if password hash matches stored hash, reject if not.
        if (!isValidPassword) {
            res.render("index", {
                uiMessages: { login: "Invalid login credentials, please try again." }
            });
            return;
        }
        
        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(user.id);
    
        // Issue tokens
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax", // Mitigates CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days 
        });
    
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax", // Mitigates CSRF
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
    
        // Redirect to protected route once logged in
        res.redirect("/notes");

    } catch (error) {
        res.render("index", {
            uiMessages: { login: "An unexpected login error occurred, please try again." }
    });  
    }
}

export async function logout(req, res) {
    // Remove both tokens if logout is forced.
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax"
        });
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax"
        });
        res.redirect("/");
    } catch (error) {
        res.redirect("/");
    }
}