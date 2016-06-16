import * as moment from 'moment';

export class Event {
  raw: string;
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
    this.raw = line;
    this.ip = match[1];
    this.rfc = match[2];
    this.user = match[3];
    this.date = moment(match[4], 'DD/MMM/YYYY:HH:mm:ss Z').toDate();
    this.request = match[5];
    this.section = sectionMatch !== null ? sectionMatch[1] : '/';
    this.status = parseInt(match[6]);
    this.size = parseInt(match[7]);
  }

};
