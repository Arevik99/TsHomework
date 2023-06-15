import fs from 'fs';
import csv from 'csv-parser';

export class CsvReader {
    readCSVFile(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            try {
                fs.createReadStream(filePath)
                    .on('error', (error) => reject(`Error while reading file: ${error}`))
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => resolve(results));
            }
            catch (error) {
                reject(`Error while creating the read stream: ${error}`);
            }
        });
    }
}