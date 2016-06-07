/// <reference path="node.d.ts" />

import * as fs from 'fs';
import * as readline from 'readline';
import * as graph from './graph';

graph.graph();

var offset : number = 0;
var lastSeen : string = null;
var requestsPerMin: number = 0;


// watches log file for changes every 100ms
fs.watchFile("./test.log", {interval: 100}, (curr, prev) => {
  interface options {
    start: number
  }

  var lineReader = readline.createInterface({
    // opens read stream starting at the last point we've seen
    input: fs.createReadStream('./test.log', <options>{start: offset})
  });

  lineReader.on('line', (line) => {
    // + 1 for newline character not included in string
    offset += line.length + 1;

    const parsed = parseLine(line);

    // send off to be processed and graphed.
    if (parsed !== null){
      lastSeen = parsed.date;
      graph.addData(parsed.date, parseInt(parsed.size));
   }
  });
});

function parseLine(line){
  const pattern = /^([\d.-]+) ([\w.-]+) ([\w.-]+) \[([\w/: -]+)\] "([\w /.-]+)" ([\d]{3}|-) ([\d-]+)$/;
  const match = pattern.exec(line);
  if (match === null){
    return null;
  }
  return {
    ip: match[1],
    rfc: match[2],
    user: match[3],
    date: match[4],
    request: match[5],
    status: match[6],
    size: match[7]
  };
}
