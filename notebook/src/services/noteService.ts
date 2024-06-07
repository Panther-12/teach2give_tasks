import mssql from 'mssql'
import lodash from 'lodash'
import { Project } from "../interfaces/noteInterface";
import {v4} from 'uuid'
import { config } from '../config/db.config';

export class ProjectService{

    async createProject(proj: Project){
        let pool = await mssql.connect(config)

        
        // Projects.push(newProject);
        let result = await (await pool.request()
        .input("ProjectName", proj.name)
        .input("ProjectDescription", proj.description)
        .input("EndDate", proj.end_date)
        .execute("addProject")).rowsAffected

        console.log(result);
        

        if(result[0] == 1){
            return {
                message: "Project created successfully"
            }
        }else{
            return {
                error: "Unable to create Project"
            }
        }
   
    }

    async updateProject(proj_id:string, proj:Project){
        let pool = await mssql.connect(config)
        //check if project exists
        let ProjectExists = await (await pool.request().query(`SELECT * FROM Project WHERE ProjectID='${proj_id}'`)).recordset

        console.log(ProjectExists);
        

        if(lodash.isEmpty(ProjectExists)){
            return {
                error: "Project not found"
            }
        }else{

        let result = (await pool.request()
        .input("ProjectID", ProjectExists[0].ProjectID)
        .input("ProjectName", proj.name)
        .input("ProjectDescription", proj.description)
        .input("EndDate", proj.end_date)
        .input("StatusID", 2)
        .execute("updateProject")).rowsAffected

        if(result[0] < 1){
            return {
                error: "Was not able to update"
            }
        }else{
            return {
                message: "Project updated successfully"
            };
        }
                    
    }
    }

    async fetchProjects(){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query('SELECT * FROM Project')).recordset
        return {
            Projects: response
        }
    }

    async fetchOneProject(proj_id:string){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query(`SELECT * FROM Project WHERE ProjectID = '${proj_id}'`)).recordset

        if(response.length < 1){
            return "No Project found"
        }else{
            return {
                Project: response[0]
            };
        }
    }

    async deleteProject(proj_id:string){
        let pool = await mssql.connect(config)
        let response = (await pool.request().query(`SELECT * FROM Project WHERE ProjectID = '${proj_id}'`)).recordset
        
        if(response.length < 1){
            return "Project not found"
        }else{
            await pool.request().query(`DELETE FROM Project WHERE ProjectID = '${proj_id}'`)
            return "Project deleted successfully"
        }
        
    }
}