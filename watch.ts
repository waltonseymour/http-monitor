/// <reference path='typings/index.d.ts' />
/// <reference path='node.d.ts' />

import { watchFile, createReadStream } from 'fs';
import { createInterface, ReadLine } from 'readline';
import { event, parseEvent, processEvent} from './event';
import * as _ from 'lodash';

let offset: number = 0;

// watches log file for changes every 100ms
watchFile('./test.log', {interval: 100}, () => {
  // opens read stream starting at the last point we've seen
  let lineReader: ReadLine = createInterface({
    input: createReadStream('./test.log', <any>{start: offset})
  });

  lineReader.on('line', (line) => {
    // + 1 for newline character not included in string
    offset += line.length + 1;
    let parsed: event = parseEvent(line);
    // send off to be processed and graphed.
    if (parsed !== null){
      processEvent(parsed);
    }
  });
});

// setInterval(() => {
//   traffic.shift();
//   traffic.push(0);
//   graph.addData(_.fill(Array(120), 'swag'), traffic);
// }, 1000);
