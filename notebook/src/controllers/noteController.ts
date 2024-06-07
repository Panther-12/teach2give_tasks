import { Note } from "../interfaces/noteInterface";
import express, { Response, Request } from 'express';
import { NoteService } from "../services/noteService";

const noteService = new NoteService()

const fetchAllnotes = (req: Request, res: Response) =>{
    noteService.fetchNotes().then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const fetchOnenote = (req: Request, res: Response) =>{
    noteService.fetchOneNote(req.params.id).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const addnote = (req: Request, res: Response) =>{
    let note: Note = req.body
    noteService.createNote(note).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const updatenote = (req: Request, res: Response) =>{
    let note: Note = req.body
    noteService.updateNote(req.params.id, note).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const patchnote = (req: Request, res: Response) =>{
    let note: Note = req.body
    noteService.updateNote(req.params.id, note).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const deletenote = (req: Request, res: Response) =>{
    noteService.deleteNote(req.params.id).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

export {
    fetchAllnotes,
    fetchOnenote,
    updatenote,
    addnote,
    deletenote,
    patchnote
}