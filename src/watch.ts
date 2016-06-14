import * as _ from 'lodash';
import { watchFile, createReadStream } from 'fs';
import { createInterface, ReadLine } from 'readline';
import { event, parseEvent, processEvent, requestWindow } from './event';

export class Watcher {
  offset: number = 0;
  file: string;

  constructor(file: string){
    this.file = file;
  }

  watch(): void {
    // watches log file for changes every 100ms
    watchFile(this.file, {interval: 100}, () => {
      // opens read stream starting at the last point we've seen
      let lineReader: ReadLine = createInterface({
        input: createReadStream('./test.log', <any>{start: this.offset})
      });

      lineReader.on('line', (line) => {
        // + 1 for newline character not included in string
        this.offset += line.length + 1;
        let parsed: event = parseEvent(line);
        // send off to be processed and graphed.
        if (parsed !== null){
          processEvent(parsed);
        }
      });
    });
  }
}
