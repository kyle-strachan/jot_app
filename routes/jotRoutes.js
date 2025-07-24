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

// Register a new user
router.post("/register", register);

// Login/logout existing user
router.post("/login", login);
router.post("/logout", logout);

// Get existing notes
router.get("/notes", authMiddleware, noCache, getNotes);

// Show new note entry form
router.get("/notes/new", authMiddleware, noCache, renderNewNoteForm);

// Create new note
router.post("/notes", authMiddleware, createNote);

// Delete a single note
router.delete("/notes/:id", authMiddleware, deleteNote);

// Show edit form
router.get("/notes/:id/edit", authMiddleware, noCache, renderEditNoteForm);

// Edit a single note
router.put("/notes/:id", authMiddleware, editNote);

export default router;