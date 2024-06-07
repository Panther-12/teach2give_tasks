import { Project } from "../interfaces/noteInterface";
import express, { Response, Request } from 'express';
import { ProjectService } from "../services/noteService";

const projectService = new ProjectService()

const fetchAllProjects = (req: Request, res: Response) =>{
    projectService.fetchProjects().then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const fetchOneProject = (req: Request, res: Response) =>{
    projectService.fetchOneProject(req.params.id).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const addProject = (req: Request, res: Response) =>{
    let project: Project = req.body
    projectService.createProject(project).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const updateProject = (req: Request, res: Response) =>{
    let project: Project = req.body
    projectService.updateProject(req.params.id, project).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const patchProject = (req: Request, res: Response) =>{
    let project: Project = req.body
    projectService.updateProject(req.params.id, project).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

const deleteProject = (req: Request, res: Response) =>{
    projectService.deleteProject(req.params.id).then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(500).json(err)
    })
}

export {
    fetchAllProjects,
    fetchOneProject,
    updateProject,
    addProject,
    deleteProject,
    patchProject
}