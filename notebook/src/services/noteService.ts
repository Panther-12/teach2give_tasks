import mssql from 'mssql'
import lodash from 'lodash'
import { Note } from "../interfaces/noteInterface";
import {v4} from 'uuid'
import { config } from '../config/db.config';

export class NoteService{

    // Create a new note
    async createNote(note: Note){
        let pool = await mssql.connect(config)

        
        let result = await (await pool.request()
        .input("NoteID", v4())
        .input("NoteTitle", note.title)
        .input("NoteContent", note.content)
        .input("CreatedAt", note.created_at || new Date().toISOString())
        .execute("addNote")).rowsAffected

        console.log(result);
        

        if(result[0] == 1){
            return {
                message: "Note created successfully"
            }
        }else{
            return {
                error: "Failed to create the Note"
            }
        }
   
    }

    // Update a specified note
    async updateNote(note_id:string, note:Note){
        let pool = await mssql.connect(config)

        // Check if Note exists
        let NoteExists = await (await pool.request().query(`SELECT * FROM Notebook WHERE NoteID='${note_id}'`)).recordset

        console.log(NoteExists);
        
        // If the note does not exist return a custom error message
        if(lodash.isEmpty(NoteExists)){
            return {
                error: "The Note was not found"
            }
        }else{

        let result = (await pool.request()
        .input("NoteID", NoteExists[0].NoteID)
        .input("NoteTitle", note.title)
        .input("NoteContent", note.content)
        .input("CreatedAt", note.created_at || NoteExists[0].CreatedAt)
        .execute("updateNote")).rowsAffected

        if(result[0] < 1){
            return {
                error: "The Note update failed"
            }
        }else{
            return {
                message: "Note updated successfully"
            };
        }
                    
    }
    }

    // Get all the notes
    async fetchNotes(){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query('SELECT * FROM Notebook')).recordset
        return {
            Notes: response
        }
    }

    // Get one note 
    async fetchOneNote(note_id:string){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query(`SELECT * FROM Notebook WHERE NoteID = '${note_id}'`)).recordset

        if(response.length < 1){
            return "No Note found"
        }else{
            return {
                Note: response[0]
            };
        }
    }

    // Delete a specified note
    async deleteNote(note_id:string){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query(`SELECT * FROM Notebook WHERE NoteID = '${note_id}'`)).recordset
        
        if(response.length < 1){
            return "Note not found"
        }else{
            await pool.request().query(`DELETE FROM Notebook WHERE NoteID = '${note_id}'`)
            return "Note deleted successfully"
        }
        
    }
}