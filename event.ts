import * as moment from 'moment';
import * as _ from 'lodash';
import * as graph from './graph';

// need to make these not global
export const requestWindow : Array<number> = [0];
// seconds
const WINDOW_SIZE = 30;
let alert: boolean = false;

// Eternity stats
let elapsed = 0;
let Ex = 0;
let Ex2 = 0;
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

export function processEvent(parsed: event): void {
  // fix to only deal with events as they come in.
  // assumes time stamps are proper
  if (moment().toDate().getTime() - parsed.date.getTime() > WINDOW_SIZE * 1000){
    return;
  }

  if (!pageTraffic[parsed.section]) {
    pageTraffic[parsed.section] = 1;
  }

  else {
    pageTraffic[parsed.section]++;
  }
  // assumes the last place in array
  // !! not true for data in log before program
  let index = requestWindow.length === 0 ? 0 : requestWindow.length -1;
  requestWindow[index]++;
}

function updateStats(point): void {
  elapsed++;
  Ex += point;
  Ex2 += point ** 2;
  // allows a rolling standard devation
  std_dev = ((Ex2 - (Ex ** 2)/ elapsed) / elapsed) ** 0.5;
  mean = Ex / elapsed;
}

function checkAlert(): void {
  let windowMean = _.sum(requestWindow) / requestWindow.length;
  if ((windowMean - mean > std_dev) && alert === false){
    alert = true;
    console.log('alert');
  }
  else if ((windowMean - mean < std_dev) && alert === true){
    alert = false;
    console.log('alert removed');
  }
}

graph.graph();

//should be in a seperate file
setInterval(() => {
  graph.addData(_.fill(Array(WINDOW_SIZE), 'a'), requestWindow);
  if (requestWindow.length < WINDOW_SIZE) {
    requestWindow.push(0);
    return;
  }
  let point: number = requestWindow.shift();
  requestWindow.push(0);
  updateStats(point);
  checkAlert();
}, 1000);
