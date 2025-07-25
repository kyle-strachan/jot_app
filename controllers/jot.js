import JotNote from "../models/notes.js"
import User from "../models/users.js"

export function renderIndex(req, res) {
    res.render("index", { title: "JOT HOME" , uiMessages: { login: null }});
}

export async function createNote(req, res) {
    // Inserts new note into the database
    try {
        const { title, body, color } = req.body;
        await JotNote.create({
            username: req.userId,
            title,
            body,
            color
        });
        res.redirect('/notes/');
    } catch (error) {
        res.status(500).render("error/error", { message: "Unable to insert note, try again later."});
    }
}

export async function getNotes(req, res) {
    // Get all notes for a single user, sorted by last update date newest to oldest
    try {
        const notes = await JotNote.find({ username: req.userId }).sort({ date: -1 });
        const user = await User.findById(req.userId);
        const username = user.username // To display username while logged in
        res.render("notes/index", { notes, username });
    } catch (error) {
        res.status(500).render("error/error", { message: "Unable to find your notes, try again later."});
    }
}

export async function renderNewNoteForm(req, res) {
    // Load create note form
    res.render("notes/create");
}

export async function deleteNote(req, res) {
    // Delete a single note
    try {
        // Check note belongs to logged in user (broken access control mitigation)
        const note = await JotNote.findOne({ _id: req.params.id, username: req.userId });
        if (!note) {
            // Note is either not found or user does not have permission to delete it
            return res.status(404).send({ message: "Unable to modify this note." });
        }
        await note.deleteOne();
        res.redirect("/notes/");
    } catch (error) {
        res.status(500).render("error/error", { message: "Unable to delete note, try again later."});
    }
}

export async function renderEditNoteForm(req, res) {
    // Load edit note form
    try {
        // Get note with username check for security to populate form fields
        const note = await JotNote.findOne({ _id: req.params.id, username: req.userId });
        if (!note) {
            return res.status(404).send("Note not found");
        }
        res.render("notes/edit", { note });
    } catch (error) {
        res.status(500).render("error/error", { message: "Unable to edit note, try again later."});
    }
}

export async function editNote(req, res) {
    // Update note in database and return to view all notes
    try {
        const { title, body, color } = req.body;
        const updateDate = new Date();
        const note = await JotNote.findOneAndUpdate(
            { _id: req.params.id, username: req.userId }, 
            { title, body, color, date: updateDate },
            { new: true }
        );
        if (!note) {
            // Note is either not found or user does not have permission to edit it
            return res.status(404).send({ message: "Unable to modify this note." });
        }
        res.redirect("/notes/");
    } catch (error) {
        console.error("Error updating note:", error);
        // Regenerate the edit form with the failed data
        res.status(400).render("/notes/edit", {
            body: req.body,
            error: "Error updating note."
        });
    }
}