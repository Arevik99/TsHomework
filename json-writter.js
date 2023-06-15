import fs from 'fs';

export class JsonWritter {
    writeToJSONFile(filePath, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(data), (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.length);
                }
            });
        });
    }
}
