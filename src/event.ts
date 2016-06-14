import * as moment from 'moment';
import * as _ from 'lodash';

export class Event {
  ip: string;
  rfc: string;
  user: string;
  date: Date;
  request: string;
  section: string;
  status: number;
  size: number;

  constructor(line: string) {
    const pattern = /^([\d.-]+) ([\w.-]+) ([\w.-]+) \[([\w/: -]+)\] "([\w /.-]+)" ([\d]{3}|-) ([\d-]+)$/;
    const match = pattern.exec(line);

    if (match === null) { throw new Error('Invalid log format'); }

    const sectionPattern = / (\/\w+)\//;
    let sectionMatch = sectionPattern.exec(match[5]);
    this.ip = match[1];
    this.rfc = match[2];
    this.user = match[3];
    this.date = moment(match[4], 'MM/DD/YYYY:HH:mm:ss Z').toDate();
    this.request = match[5];
    this.section = sectionMatch !== null ? sectionMatch[1] : '/';
    this.status = parseInt(match[6]);
    this.size = parseInt(match[7]);
  }
};

export class EventProcessor {
  WINDOW_SIZE: number = 120;
  requestWindow: Array<number> = _.fill(Array(this.WINDOW_SIZE), 0);
  sectionTraffic: Object = {};

  /*
    process: Takes in an log line as a string and parses an Event object.
    It then increments requestWindow and sectionTraffic as needed.
  */
  process(line: string): void {
    const event = new Event(line);
    if (moment().toDate().getTime() - event.date.getTime() > this.WINDOW_SIZE * 1000) {
      return;
    }

    if (!this.sectionTraffic[event.section]) {
      this.sectionTraffic[event.section] = 1;
    }
    else {
      this.sectionTraffic[event.section]++;
    }
    this.requestWindow[this.requestWindow.length - 1]++;
  }

  /*
    processHistorical: Takes in an log line as a string and parses an Event object.
    It then increments requestWindow and sectionTraffic as needed.
  */
  processHistorical(line: string): void {
    const event = new Event(line);
    if (moment().toDate().getTime() - event.date.getTime() > this.WINDOW_SIZE * 1000) {
      return;
    }

    if (!this.sectionTraffic[event.section]) {
      this.sectionTraffic[event.section] = 1;
    }
    else {
      this.sectionTraffic[event.section]++;
    }
    this.requestWindow[this.requestWindow.length - 1]++;
  }

}
