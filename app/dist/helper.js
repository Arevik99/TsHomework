"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class Helper {
    constructor(directoryPath) {
        this.csvFilesList = [];
        this.directoryPath = path_1.default.resolve(process.cwd(), directoryPath);
    }
    getCsvFilePaths() {
        fs_1.default.readdirSync(this.directoryPath
        // , (err) => {
        // if (err) {
        //     console.error('Error reading directory:', err);
        //     return;
        // }
        // }
        ).filter(file => path_1.default.extname(file) === '.csv').forEach((file) => {
            this.csvFilesList.push(path_1.default.resolve(this.directoryPath, file));
        });
        return this.csvFilesList;
    }
}
exports.Helper = Helper;
