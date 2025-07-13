import { Router } from "express";
import {
    createNote,
    getNotes,
    renderNewNoteForm,
    deleteNote,
    editNote,
    renderEditNoteForm
} from "../controllers/jot.js"
import {
    register,
    login,
    logout
} from "../controllers/auth.js"
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Get existing notes
router.get("/notes", authMiddleware, getNotes)

// Create new note
router.post("/notes", authMiddleware, createNote);

// Show new entry form
router.get("/notes/new", authMiddleware, renderNewNoteForm);

// Delete a single note
router.delete("/notes/:id", authMiddleware, deleteNote);

// Show edit form
router.get("/notes/:id/edit", authMiddleware, renderEditNoteForm);

// Edit a single note
router.put("/notes/:id", authMiddleware, editNote);

// Register a new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

// Logout user
router.post("/logout", logout);

export default router;