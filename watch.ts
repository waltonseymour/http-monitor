/// <reference path='typings/index.d.ts' />
/// <reference path='node.d.ts' />

import { watchFile, createReadStream } from 'fs';
import { createInterface, ReadLine } from 'readline';
import * as moment from 'moment';
import * as _ from 'lodash';
// import * as graph from './graph.ts';
//
// graph.graph();

// holds number of requests per second for the last two minutes
// traffic[0] is the oldest and traffic[119]
const traffic: Array<number> = _.fill(Array(120), 0);
let offset: number = 0;
const pageTraffic = {};

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
      processLine(parsed);
   }
  });
});

setInterval(() => {
  traffic.shift();
  traffic.push(0);
  //graph.addData(_.fill(Array(120), 'swag'), traffic);
}, 1000);

interface parsedLine{
  ip: string,
  rfc: string,
  user: string,
  date: Date,
  request: string,
  status: number,
  size: number
};

function parseLine(line: string): parsedLine{
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

function processLine(parsed: parsedLine){
  if(!pageTraffic[parsed.request]){
    pageTraffic[parsed.request] = 1;
  }
  else{
    pageTraffic[parsed.request] += 1;
  }
  console.log(pageTraffic);
}
