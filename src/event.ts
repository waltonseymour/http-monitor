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

  constructor(line: string){
    const pattern = /^([\d.-]+) ([\w.-]+) ([\w.-]+) \[([\w/: -]+)\] "([\w /.-]+)" ([\d]{3}|-) ([\d-]+)$/;
    const match = pattern.exec(line);
    if (match === null) {
      // might want to throw exception
      return null;
    }
    else {
      // regex to extract section ie. /posts /users ..etc
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
  }

};

export class EventProcessor {
  WINDOW_SIZE: number = 120;
  requestWindow: Array<number> = _.fill(Array(this.WINDOW_SIZE), 0);
  pageTraffic = {};

  parse(line: string): Event {
    return new Event(line);
  }

  process(parsed: Event): void {
    // fix to only deal with events as they come in.
    // assumes time stamps are proper
    if (moment().toDate().getTime() - parsed.date.getTime() > this.WINDOW_SIZE * 1000){
      return;
    }

    if (!this.pageTraffic[parsed.section]) {
      this.pageTraffic[parsed.section] = 1;
    }

    else {
      this.pageTraffic[parsed.section]++;
    }
    let index = this.requestWindow.length -1;
    this.requestWindow[index]++;
  }

}
