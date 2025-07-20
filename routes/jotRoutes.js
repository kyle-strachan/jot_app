import { Router } from "express";
import {
    createNote,
    getNotes,
    renderNewNoteForm,
    deleteNote,
    editNote,
    renderEditNoteForm,
    renderIndex
} from "../controllers/jot.js"
import {
    register,
    login,
    logout
} from "../controllers/auth.js"
import { authMiddleware } from "../middleware/auth.js";
import { noCache } from "../middleware/noCache.js";

const router = Router();

// Show homepage
router.get("/", renderIndex);

// Get existing notes
router.get("/notes", authMiddleware, noCache, getNotes);

// Create new note
router.post("/notes", authMiddleware, createNote);

// Show new entry form
router.get("/notes/new", authMiddleware, noCache, renderNewNoteForm);

// Delete a single note
router.delete("/notes/:id", authMiddleware, deleteNote);

// Show edit form
router.get("/notes/:id/edit", authMiddleware, noCache, renderEditNoteForm);

// Edit a single note
router.put("/notes/:id", authMiddleware, editNote);

// Register a new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

// Logout user
router.post("/logout", logout);

export default router;