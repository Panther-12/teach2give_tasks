import { Router } from "express";
import { addnote, deletenote, fetchAllnotes, fetchOnenote, updatenote, patchnote } from "../controllers/noteController";


const noteRouter = Router();


// note Routes
noteRouter.get('/',fetchAllnotes);
noteRouter.get('/:id',fetchOnenote);
noteRouter.post('/',addnote);
noteRouter.put('/:id',updatenote);
noteRouter.delete('/:id',deletenote);
noteRouter.patch('/:id',patchnote);


export default noteRouter;