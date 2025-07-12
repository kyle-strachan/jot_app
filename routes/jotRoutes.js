import { Router } from "express";
import {
    createNote,
    getNotes,
    renderNewNoteForm,
    deleteNote,
    editNote,
    renderEditNoteForm
} from "../controllers/jot.js"

const router = Router();

// Get existing notes
router.get("/notes", getNotes)

// Create new note
router.post("/notes", createNote);

// Show new entry form
router.get("/notes/new", renderNewNoteForm);

// Delete a single note
router.delete("/notes/:id", deleteNote);

// Show edit form
router.get("/notes/:id/edit", renderEditNoteForm);

// Edit a single note
router.put("/notes/:id", editNote)



export default router;