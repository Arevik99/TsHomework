import { parentPort } from 'worker_threads';
import { JsonWritter } from './json-writter.js';
import { CsvReader } from './csv-reader.js';
import path from 'path';

parentPort.on('message', (message) => {
  if (message.taskIndex && message.filePath) {
    const taskIndex = message.taskIndex;
    const filePath = message.filePath;
    new CsvReader().readCSVFile(filePath).then(
      (data) => {
        const jsonFilePath = path.join('./Converted', path.parse(filePath).name);
        return new JsonWritter().writeToJSONFile(`${jsonFilePath}.json`, data);
      },
      (err) => {
        throw new Error(`Error while reading file: ${err}`);
      }).then((numOfRecords) => {
        parentPort.postMessage({ event: 'taskCompleted', taskIndex, numOfRecords });
      }, (err) => {
        parentPort.postMessage(`Error while writting file: ${err}`)
      });
  }
});
