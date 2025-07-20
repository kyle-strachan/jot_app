import JotNote from "../models/notes.js"
import User from "../models/users.js"

export function renderIndex(req, res) {
    console.log("renderIndex");
    res.render("index", { title: "JOT HOME" , uiMessages: { login: null }});
}

export async function createNote(req, res) {
    // debugger;
    try {
        const { title, body, color } = req.body;
        // console.log(req.body.color);
        await JotNote.create({
            username: req.userId,
            title,
            body,
            color
        });
        res.redirect('/notes/');
    } catch (error) {
        console.error("Error creating new note:", error);
        res.status(500);
    }
}

export async function getNotes(req, res) {
    try {
        // debugger;
        const notes = await JotNote.find({ username: req.userId }).sort({ date: -1 });
        const user = await User.findById(req.userId);
        const username = user.username
        res.render("notes/index", { title: "My Notes", notes, username });
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        res.status(500).send("Failed to fetch notes.");
    }
}

export async function renderNewNoteForm(req, res) {
    res.render("notes/create", {
        title: "Create a New Note"
    });
}

export async function deleteNote(req, res) {
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
        console.error("Error deleting note:", error);
        res.status(500).send("Error deleting note.");
    }
}

export async function renderEditNoteForm(req, res) {
    try {
        const noteId = req.params.id;
        const note = await JotNote.findById(noteId);
        if (!note) {
            res.status(404).send("Note not found");
        }
        res.render("notes/edit", {
            title: "Update Note",
            note
        });
    } catch (error) {
        console.error("Error fetching note to edit.");
        res.status(500).send("Error loading edit form.");
    }
}

export async function editNote(req, res) {
    try {
        const { title, body, color } = req.body;
        const note = await JotNote.findOneAndUpdate(
            { _id: req.params.id, username: req.userId }, 
            { title, body, color },
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
            title: "Edit Note",
            body: req.body,
            error: "Error updating note."
        });
    }
}