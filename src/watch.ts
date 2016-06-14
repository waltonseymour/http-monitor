import * as _ from 'lodash';
import { watchFile, createReadStream } from 'fs';
import { createInterface, ReadLine } from 'readline';
import { Event, EventProcessor} from './event';

export class Watcher {
  offset: number = 0;
  file: string;

  constructor(file: string){
    this.file = file;
  }

  watch(processor: EventProcessor): void {
    // watches log file for changes every 100ms
    watchFile(this.file, {interval: 100}, () => {
      // opens read stream starting at the last point we've seen
      let lineReader: ReadLine = createInterface({
        input: createReadStream('./test.log', <any>{start: this.offset})
      });

      lineReader.on('line', (line) => {
        // + 1 for newline character not included in string
        this.offset += line.length + 1;
        let parsed: Event = new Event(line);
        // send off to be processed and graphed.
        if (parsed !== null){
          processor.process(parsed);
        }
      });
    });
  }
}
