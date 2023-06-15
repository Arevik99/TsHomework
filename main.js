import path from 'path';
import fs from 'fs';
import process from 'process';
import { Helper } from './helper.js';

import { Worker } from 'worker_threads';
const distributeTasks = () => {
  return new Promise((resolve, reject) => {
    if (process.argv.length != 3) {
      reject("Invalid number of arguments!");
      process.exit();
    }
    let csvFilesList = new Helper(process.argv[2].toString()).getCsvFilePaths();
    let threadsArray = [];
    for (let i = 0; i < 2; i++) {
      let worker = new Worker('./worker.js');
      threadsArray.push(worker);
      worker.on('online', () => {
        worker.postMessage({ taskIndex: i, filePath: csvFilesList[i] });
      });
    }
    let numOfAllrecords = 0;
    let currentTaskIndex = 0;
    let terminatedCount = 0;
    threadsArray.forEach((worker) => {
      worker.on('message', (message) => {
        currentTaskIndex++;
        numOfAllrecords += message.numOfRecords;
        if (currentTaskIndex < csvFilesList.length) {
          worker.postMessage({ taskIndex: currentTaskIndex, filePath: csvFilesList[currentTaskIndex] });
        } else {
          terminatedCount++;
          worker.terminate();
        }
      });
      worker.on('error', (error) => reject(`Error while workingwith threads: ${error}`));
      worker.on('exit', (code) => {
        if (terminatedCount === csvFilesList.length)
          resolve(numOfAllrecords);
        process.exit();
      });
    });
  });
}
distributeTasks().then(
  result => console.log(result)).catch(err => console.error(err));
