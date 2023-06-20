import http from 'http';
import { Distributor } from './file-distributor.js';
import path from 'path';
import fs from 'fs';

http.createServer((req, res) => { handleServerRequests(req, res) }).listen(8090);

function handleServerRequests(req, res) {
  if (req.method === 'POST') {
    if (req.url === '/exports') {
      handlePostRequest(req, res);
    }
    else {
      handleBadRequests(res);
    }
  }
  if (req.method === 'DELETE') {
    if (req.url.startsWith('/files/')) {
      handleDeleteRequest(req, res);
    }
    else {
      handleBadRequests(res);
    }
  }
  if (req.method === 'GET') {
    if (req.url === '/files') {
      handleGetRequest(req, res);
    }
    else {
      if (req.url.startsWith('/files/')) {
        handleGetByFileName(req, res);
      }
      else {
        handleBadRequests(res);
      }
    }
  }
}

function handlePostRequest(req, res) {
  let directoryName;
  req.on('data', (chunk) => {
    directoryName = JSON.parse(chunk).csvPath;
  });

  req.on('end', () => {
    new Distributor().distributeTasks(directoryName).then(
      (result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Data is converted and saved successfully!');
      }).catch((err) => {
        res.statusCode = 403;
        res.end('Bad Request!');
      });

  });
}

function handleDeleteRequest(req, res) {
  const fileName = req.url.split('/').pop();
  const filePath = path.resolve(process.cwd(), 'Converted', fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found.');
    }
    else {
      res.statusCode = 200;
      res.end('Successfully deleted!');
    }
  });
}

function handleGetByFileName(req, res) {
  const fileName = req.url.split('/').pop();
  const filePath = path.resolve(process.cwd(), 'Converted', fileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found.');
      return;
    }
    else {
      res.statusCode = 200;
      res.end(data.toString());
    }
  });
}

function handleGetRequest(req, res) {
  let directoryPath = path.resolve(process.cwd(), 'Converted');
  let dirContent = [];
  fs.readdirSync(directoryPath, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found.');
    }
  }).filter((fileName) => { dirContent.push(fileName); });
  res.end(dirContent.toString());
}

function handleBadRequests(res) {
  res.statusCode = 403;
  res.end('Bad Request!');
}