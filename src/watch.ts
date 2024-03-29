import * as _ from 'lodash';
import { watchFile, createReadStream } from 'fs';
import { createInterface, ReadLine } from 'readline';
import { EventProcessor } from './eventProcessor';

export class Watcher {
  offset: number = 0;
  file: string;
  processor: EventProcessor;

  constructor(file: string, processor: EventProcessor) {
    this.file = file;
    this.processor = processor;

    // grabs historical lines
    this.handleLine(true);
  }

  /*
    watch: Regularly polls log file for changes and then opens a read stream
    at the last point we've seen data. It then sends the Event object off to
    a processor to handle
  */
  watch(): void {
    // Polls log file for changes every 100ms
    watchFile(this.file, { interval: 100 }, () => {
      this.handleLine();
    });
  }

  handleLine(historical = false): void {
    // Opens read stream starting at the last point we've seen
    let lineReader: ReadLine = createInterface({
      input: createReadStream(this.file, <any>{ start: this.offset })
    });
    lineReader.on('line', (line) => {
      // + 1 for newline character not included in string
      this.offset += line.length + 1;
      this.processor.process(line, historical);
    });
  }

}
