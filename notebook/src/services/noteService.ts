import mssql from 'mssql'
import lodash from 'lodash'
import { Note } from "../interfaces/noteInterface";
import {v4} from 'uuid'
import { config } from '../config/db.config';

export class NoteService{

    async createNote(note: Note){
        let pool = await mssql.connect(config)

        
        // Notes.push(newNote);
        let result = await (await pool.request()
        .input("NoteName", note.title)
        .input("NoteDescription", note.content)
        .input("EndDate", note.created_at)
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
        let NoteExists = await (await pool.request().query(`SELECT * FROM Note WHERE NoteID='${note_id}'`)).recordset

        console.log(NoteExists);
        

        if(lodash.isEmpty(NoteExists)){
            return {
                error: "Note not found"
            }
        }else{

        let result = (await pool.request()
        .input("NoteID", NoteExists[0].NoteID)
        .input("NoteName", note.title)
        .input("NoteDescription", note.content)
        .input("EndDate", note.created_at)
        .input("StatusID", 2)
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
        let response = (await pool.request().query('SELECT * FROM Note')).recordset
        return {
            Notes: response
        }
    }

    async fetchOneNote(note_id:string){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query(`SELECT * FROM Note WHERE NoteID = '${note_id}'`)).recordset

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
        let response = (await pool.request().query(`SELECT * FROM Note WHERE NoteID = '${note_id}'`)).recordset
        
        if(response.length < 1){
            return "Note not found"
        }else{
            await pool.request().query(`DELETE FROM Note WHERE NoteID = '${note_id}'`)
            return "Note deleted successfully"
        }
        
    }
}