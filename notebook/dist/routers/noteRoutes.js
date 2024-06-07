"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const noteRouter = (0, express_1.Router)();
// note Routes
noteRouter.get('/', noteController_1.fetchAllnotes);
noteRouter.get('/:id', noteController_1.fetchOnenote);
noteRouter.post('/', noteController_1.addnote);
noteRouter.put('/:id', noteController_1.updatenote);
noteRouter.delete('/:id', noteController_1.deletenote);
noteRouter.patch('/:id', noteController_1.patchnote);
exports.default = noteRouter;
