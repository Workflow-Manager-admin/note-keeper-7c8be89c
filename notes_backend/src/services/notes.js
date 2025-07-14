const fs = require('fs');
const path = require('path');

const storageFilePath = process.env.NOTES_STORAGE_PATH || path.resolve(__dirname, '../../data/notes.json');

/**
 * Simple persistent storage for notes using a JSON file.
 * Each note: { id: string, title: string, content: string, createdAt: timestamp, updatedAt: timestamp }
 */
class NotesService {
  constructor() {
    // Ensure storage file exists
    this.ensureStorage();
    // Cache notes in memory
    this.notes = this.loadNotes();
  }

  ensureStorage() {
    const dir = path.dirname(storageFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(storageFilePath)) {
      fs.writeFileSync(storageFilePath, JSON.stringify([]));
    }
  }

  loadNotes() {
    try {
      const data = fs.readFileSync(storageFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  saveNotes(notes) {
    fs.writeFileSync(storageFilePath, JSON.stringify(notes, null, 2));
    this.notes = notes;
  }

  // PUBLIC_INTERFACE
  getAllNotes() {
    /** Returns all notes. */
    return this.notes;
  }

  // PUBLIC_INTERFACE
  getNoteById(id) {
    /** Returns a note by its ID. */
    return this.notes.find(note => note.id === id);
  }

  // PUBLIC_INTERFACE
  createNote(note) {
    /** Adds a new note and returns it, assigning a new id. */
    const createdAt = new Date().toISOString();
    const newNote = {
      ...note,
      id: this.generateId(),
      createdAt,
      updatedAt: createdAt,
    };
    const notes = [...this.notes, newNote];
    this.saveNotes(notes);
    return newNote;
  }

  // PUBLIC_INTERFACE
  updateNote(id, updates) {
    /** Updates an existing note. */
    const idx = this.notes.findIndex(note => note.id === id);
    if (idx === -1) return null;
    const updatedNote = {
      ...this.notes[idx],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    const notes = [
      ...this.notes.slice(0, idx),
      updatedNote,
      ...this.notes.slice(idx + 1),
    ];
    this.saveNotes(notes);
    return updatedNote;
  }

  // PUBLIC_INTERFACE
  deleteNote(id) {
    /** Removes a note by id. Returns true if deleted, false if not found. */
    const idx = this.notes.findIndex(note => note.id === id);
    if (idx === -1) return false;
    const notes = [
      ...this.notes.slice(0, idx),
      ...this.notes.slice(idx + 1),
    ];
    this.saveNotes(notes);
    return true;
  }

  generateId() {
    // Returns a short pseudo-unique id
    return Math.random().toString(36).substr(2, 9);
  }
}

module.exports = new NotesService();
