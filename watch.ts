/// <reference path='typings/index.d.ts' />
/// <reference path='node.d.ts' />

import { watchFile, createReadStream } from 'fs';
import { createInterface, ReadLine } from 'readline';
import * as moment from 'moment';
import * as _ from 'lodash';

const traffic: Array<number> = [];
let offset: number = 0;
let lastSeen: Date = null;

// watches log file for changes every 100ms
watchFile('./test.log', {interval: 100}, () => {
  // opens read stream starting at the last point we've seen
  let lineReader: ReadLine = createInterface({
    input: createReadStream('./test.log', <any>{start: offset})
  });

  lineReader.on('line', (line) => {
    // + 1 for newline character not included in string
    offset += line.length + 1;
    let parsed = parseLine(line);

    // send off to be processed and graphed.
    if (parsed !== null){
      lastSeen = parsed.date;
      let second: number = (lastSeen.valueOf() / 1000) % 120;
      traffic.push(second);
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
