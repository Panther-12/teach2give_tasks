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
const express_1 = __importDefault(require("express"));
const db_config_1 = require("./config/db.config");
const mssql_1 = __importDefault(require("mssql"));
const body_parser_1 = __importDefault(require("body-parser"));
const noteRoutes_1 = __importDefault(require("./routers/noteRoutes"));
const app = (0, express_1.default)();
const cors = require("cors");
require('dotenv').config();
app.use(cors());
// Configure body-parser
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Bind the router
app.use('/notes', noteRoutes_1.default);
// test connection
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield mssql_1.default.connect(db_config_1.config);
        if (pool.connected) {
            console.log("Connection established ...");
        }
        else {
            console.log("Error establishing connection");
        }
    });
}
// test connection
testConnection();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
