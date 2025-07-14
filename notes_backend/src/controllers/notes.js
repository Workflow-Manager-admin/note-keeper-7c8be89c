const notesService = require('../services/notes');

// PUBLIC_INTERFACE
/**
 * NotesController handles REST API requests for notes.
 */
class NotesController {
  // PUBLIC_INTERFACE
  async list(req, res) {
    /** Returns all notes */
    const notes = notesService.getAllNotes();
    res.json(notes);
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** Returns a note by ID */
    const note = notesService.getNoteById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  }

  // PUBLIC_INTERFACE
  async create(req, res) {
    /** Creates a new note */
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    const note = notesService.createNote({ title, content });
    res.status(201).json(note);
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** Updates a note */
    const { title, content } = req.body;
    if (!title && !content) {
      return res.status(400).json({ error: 'At least one of title or content required.' });
    }
    const updated = notesService.updateNote(req.params.id, { title, content });
    if (!updated) return res.status(404).json({ error: 'Note not found' });
    res.json(updated);
  }

  // PUBLIC_INTERFACE
  async delete(req, res) {
    /** Deletes a note */
    const deleted = notesService.deleteNote(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.status(204).send();
  }
}

module.exports = new NotesController();
