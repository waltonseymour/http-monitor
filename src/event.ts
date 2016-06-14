import * as moment from 'moment';
import * as _ from 'lodash';

export interface event {
  ip: string;
  rfc: string;
  user: string;
  date: Date;
  request: string;
  section: string;
  status: number;
  size: number;
};

export class EventProcessor {
  WINDOW_SIZE: number = 120;
  requestWindow: Array<number> = _.fill(Array(this.WINDOW_SIZE), 0);
  pageTraffic = {};

  parse(line: string): event {
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

      return {
        ip: match[1],
        rfc: match[2],
        user: match[3],
        date: moment(match[4], 'MM/DD/YYYY:HH:mm:ss Z').toDate(),
        request: match[5],
        section: sectionMatch !== null ? sectionMatch[1] : '/',
        status: parseInt(match[6]),
        size: parseInt(match[7])
      };
    }
  }

  process(parsed: event): void {
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
