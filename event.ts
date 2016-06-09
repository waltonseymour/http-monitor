import * as moment from 'moment';

const pageTraffic = {};

export interface event {
  ip: string,
  rfc: string,
  user: string,
  date: Date,
  request: string,
  section: string,
  status: number,
  size: number
};

export function parseEvent(line: string): event {
  const pattern = /^([\d.-]+) ([\w.-]+) ([\w.-]+) \[([\w/: -]+)\] "([\w /.-]+)" ([\d]{3}|-) ([\d-]+)$/;
  const match = pattern.exec(line);
  if (match === null) {
    // might want to throw exception
    return null;
  }
  else {
    // some regex to extract section ie. /posts /users ..etc
    const sectionPattern = / (.*) /;
    const section = sectionPattern.exec(match[5])[1];

    return {
      ip: match[1],
      rfc: match[2],
      user: match[3],
      date: moment(match[4], 'MM/DD/YYYY:HH:mm:ss Z').toDate(),
      request: match[5],
      section: section,
      status: parseInt(match[6]),
      size: parseInt(match[7])
    };
  }
}

export function processEvent(parsed: event) {
  if (!pageTraffic[parsed.section]) {
    pageTraffic[parsed.section] = 1;
  }
  else {
    pageTraffic[parsed.section] += 1;
  }
  console.log(pageTraffic);
}
