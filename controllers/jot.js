import JotNote from "../models/notes.js"

export async function createNote(req, res) {
    const username = "DevUI"
    try {
        const { title, body } = req.body;
        await JotNote.create({
            username,
            title,
            body
        });
        res.redirect('/notes/');
    } catch (error) {
        console.error("Error creating new note:", error);
        res.status(500);
    }
}

export async function getNotes(req, res) {
    const username = "Dev1"
    try {
        const notes = await JotNote.find().sort({ date: -1 });
        res.render("notes/index", { title: "My Notes", notes });
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
        // Would like: check logged in user is the owner of this note
        const deletedNote = await JotNote.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).send("Note not found");
        }
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
        const { title, body } = req.body;
        const updated = await JotNote.findByIdAndUpdate(req.params.id, { title, body }, { new: true });
        if (!updated) {
            return res.status(404).send("Note not found");
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