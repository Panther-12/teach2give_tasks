import mssql from 'mssql'
import lodash from 'lodash'
import { Note } from "../interfaces/noteInterface";
import {v4} from 'uuid'
import { config } from '../config/db.config';

export class NoteService{

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
                error: "Unable to create Note"
            }
        }
   
    }

    async updateNote(note_id:string, note:Note){
        let pool = await mssql.connect(config)

        //check if Note exists
        let NoteExists = await (await pool.request().query(`SELECT * FROM Notebook WHERE NoteID='${note_id}'`)).recordset

        console.log(NoteExists);
        

        if(lodash.isEmpty(NoteExists)){
            return {
                error: "Note not found"
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
                error: "Was not able to update"
            }
        }else{
            return {
                message: "Note updated successfully"
            };
        }
                    
    }
    }

    async fetchNotes(){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query('SELECT * FROM Notebook')).recordset
        return {
            Notes: response
        }
    }

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