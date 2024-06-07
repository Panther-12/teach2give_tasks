"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
const mssql_1 = __importDefault(require("mssql"));
const lodash_1 = __importDefault(require("lodash"));
const uuid_1 = require("uuid");
const db_config_1 = require("../config/db.config");
class NoteService {
    createNote(note) {
        return __awaiter(this, void 0, void 0, function* () {
            let pool = yield mssql_1.default.connect(db_config_1.config);
            let result = yield (yield pool.request()
                .input("NoteID", (0, uuid_1.v4)())
                .input("NoteTitle", note.title)
                .input("NoteContent", note.content)
                .input("CreatedAt", note.created_at || new Date().toISOString())
                .execute("addNote")).rowsAffected;
            console.log(result);
            if (result[0] == 1) {
                return {
                    message: "Note created successfully"
                };
            }
            else {
                return {
                    error: "Failed to create the Note"
                };
            }
        });
    }
    updateNote(note_id, note) {
        return __awaiter(this, void 0, void 0, function* () {
            let pool = yield mssql_1.default.connect(db_config_1.config);
            //check if Note exists
            let NoteExists = yield (yield pool.request().query(`SELECT * FROM Notebook WHERE NoteID='${note_id}'`)).recordset;
            console.log(NoteExists);
            if (lodash_1.default.isEmpty(NoteExists)) {
                return {
                    error: "The Note was not found"
                };
            }
            else {
                let result = (yield pool.request()
                    .input("NoteID", NoteExists[0].NoteID)
                    .input("NoteTitle", note.title)
                    .input("NoteContent", note.content)
                    .input("CreatedAt", note.created_at || NoteExists[0].CreatedAt)
                    .execute("updateNote")).rowsAffected;
                if (result[0] < 1) {
                    return {
                        error: "The Note update failed"
                    };
                }
                else {
                    return {
                        message: "Note updated successfully"
                    };
                }
            }
        });
    }
    fetchNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            let pool = yield mssql_1.default.connect(db_config_1.config);
            let response = (yield pool.request().query('SELECT * FROM Notebook')).recordset;
            return {
                Notes: response
            };
        });
    }
    fetchOneNote(note_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let pool = yield mssql_1.default.connect(db_config_1.config);
            let response = (yield pool.request().query(`SELECT * FROM Notebook WHERE NoteID = '${note_id}'`)).recordset;
            if (response.length < 1) {
                return "No Note found";
            }
            else {
                return {
                    Note: response[0]
                };
            }
        });
    }
    deleteNote(note_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let pool = yield mssql_1.default.connect(db_config_1.config);
            let response = (yield pool.request().query(`SELECT * FROM Notebook WHERE NoteID = '${note_id}'`)).recordset;
            if (response.length < 1) {
                return "Note not found";
            }
            else {
                yield pool.request().query(`DELETE FROM Notebook WHERE NoteID = '${note_id}'`);
                return "Note deleted successfully";
            }
        });
    }
}
exports.NoteService = NoteService;
