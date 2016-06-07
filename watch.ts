/// <reference path="node.d.ts" />

import { watchFile, createReadStream } from 'fs';
import { createInterface } from 'readline';
import * as moment from 'moment';

const traffic : Array<number> = [];
let offset : number = 0;
let lastSeen : Date = null;
let requestsPerMin: number = 0;

// watches log file for changes every 100ms
watchFile("./test.log", {interval: 100}, () => {
  let lineReader = createInterface({
    // opens read stream starting at the last point we've seen
    input: createReadStream('./test.log', <any>{start: offset})
  });

  lineReader.on('line', (line) => {
    // + 1 for newline character not included in string
    offset += line.length + 1;
    let parsed = parseLine(line);

    // send off to be processed and graphed.
    if (parsed !== null){
      lastSeen = parsed.date;
      console.log(lastSeen);
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
    date: moment(match[4], 'MM/DD/YYYY:HH:mm:ss Z').toDate(),
    request: match[5],
    status: parseInt(match[6]),
    size: parseInt(match[7])
  };
}
