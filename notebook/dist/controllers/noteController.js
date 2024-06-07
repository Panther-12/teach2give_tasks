"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchnote = exports.deletenote = exports.addnote = exports.updatenote = exports.fetchOnenote = exports.fetchAllnotes = void 0;
const noteService_1 = require("../services/noteService");
const noteService = new noteService_1.NoteService();
const fetchAllnotes = (req, res) => {
    noteService.fetchNotes().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
};
exports.fetchAllnotes = fetchAllnotes;
const fetchOnenote = (req, res) => {
    noteService.fetchOneNote(req.params.id).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
};
exports.fetchOnenote = fetchOnenote;
const addnote = (req, res) => {
    let note = req.body;
    noteService.createNote(note).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
};
exports.addnote = addnote;
const updatenote = (req, res) => {
    let note = req.body;
    noteService.updateNote(req.params.id, note).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
};
exports.updatenote = updatenote;
const patchnote = (req, res) => {
    let note = req.body;
    noteService.updateNote(req.params.id, note).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
};
exports.patchnote = patchnote;
const deletenote = (req, res) => {
    noteService.deleteNote(req.params.id).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
};
exports.deletenote = deletenote;
