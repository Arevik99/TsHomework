import path from 'path';
import fs from 'fs';

export class Helper {
    csvFilesList = [];
    directoryPath;
    constructor(directoryPath) {
        this.directoryPath = path.resolve(process.cwd(), directoryPath);
    }
    getCsvFilePaths() {
        fs.readdirSync(this.directoryPath, (err) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
        }).filter(file => path.extname(file) === '.csv').forEach((file) => {
            this.csvFilesList.push(path.resolve(this.directoryPath, file));
        });
        return this.csvFilesList;
    }
}