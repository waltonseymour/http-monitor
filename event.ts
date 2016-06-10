import * as moment from 'moment';
import * as _ from 'lodash';


export const requestWindow : Array<number> = _.fill(Array(120), 0);

// Eternity stats
let elapsed = 0;
let count = 0;
let mean = 0;
let std_dev = 0;
const pageTraffic = {};

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

export function parseEvent(line: string): event {
  const pattern = /^([\d.-]+) ([\w.-]+) ([\w.-]+) \[([\w/: -]+)\] "([\w /.-]+)" ([\d]{3}|-) ([\d-]+)$/;
  const match = pattern.exec(line);
  if (match === null) {
    // might want to throw exception
    return null;
  }
  else {
    // some regex to extract section ie. /posts /users ..etc
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

export function processEvent(parsed: event) {
  // fix to only deal with events as they come in.
  if (moment().toDate().getTime() - parsed.date.getTime() > 120 * 60 * 1000){
    return;
  }

  if (!pageTraffic[parsed.section]) {
    pageTraffic[parsed.section] = 1;
  }

  else {
    pageTraffic[parsed.section]++;
  }
  count++;
  // assumes the last place in array
  // !! not true for data in log before program
  requestWindow[requestWindow.length - 1]++;
  // mean and std_dev updated elsewhere
}

setInterval(() => {
  let point = requestWindow.shift();
  requestWindow.push(0);
  elapsed++;
  mean = count / elapsed;
  console.log(mean);
}, 1000);
