/// <reference path="node.d.ts" />

import * as fs from 'fs';
import * as readline from 'readline';

let offset : number = 0;
let lastSeen : string = null;
let requestsPerMin: number = 0;

// watches log file for changes every 100ms
fs.watchFile("./test.log", {interval: 100}, () => {
  let lineReader = readline.createInterface({
    // opens read stream starting at the last point we've seen
    input: fs.createReadStream('./test.log', <any>{start: offset})
  });

  lineReader.on('line', (line) => {
    // + 1 for newline character not included in string
    offset += line.length + 1;
    let parsed = parseLine(line);

    // send off to be processed and graphed.
    if (parsed !== null){
      lastSeen = parsed.date;
   }
  });
});

function parseLine(line: string){
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
    status: parseInt(match[6]),
    size: parseInt(match[7])
  };
}
