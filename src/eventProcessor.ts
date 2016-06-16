import * as moment from 'moment';
import * as _ from 'lodash';
import { Event } from './event';
import { Stats } from './stats';

export class EventProcessor {
  WINDOW_SIZE: number;
  requestWindow: Array<number>;
  sectionTraffic: Object = {};
  stats: Stats;
  currentBucket: number = 0;
  currentRequests: number = 0;

  constructor(stats: Stats, windowSize: number = 120){
    this.stats = stats;
    this.WINDOW_SIZE = windowSize;
    this.requestWindow = _.fill(Array(this.WINDOW_SIZE), 0);
  }

  /*
    process: Takes in an log line as a string and parses an Event object.
    It then increments requestWindow and sectionTraffic as needed.
  */
  process(line: string, historical = false): void {
    const event = new Event(line);
    if (!this.stats.startTime) {
      // first event to be processed is assumed to be the earliest
      this.stats.startTime = event.date;
    }

    this.updateSection(event.section);
    if (historical === true) {
      // buckets into seconds from historical data
      // has a off-by-one error for the last requst -- need to fix
      const epocSeconds = event.date.getTime() / 1000;
      if (epocSeconds === this.currentBucket) {
        this.currentRequests++;
      } else {
        this.stats.update(this.currentRequests);
        this.currentBucket = epocSeconds;
        this.currentRequests = 1;
      }
    } else {
      this.requestWindow[this.requestWindow.length - 1]++;
    }
  }

  updateSection(section: string): void {
    if (!this.sectionTraffic[section]) {
      this.sectionTraffic[section] = 1;
    } else {
      this.sectionTraffic[section]++;
    }
  }

  /*
    checkAlert: Will return true or false if the window mean exceeds
    the eternity mean by more than a standard_deviation.
  */
  checkAlert(): boolean {
    let windowMean = _.sum(this.requestWindow) / this.requestWindow.length;
    if ((windowMean - this.stats.mean > this.stats.std_dev) && this.stats.alert === false) {
      return true;
    } else if ((windowMean - this.stats.mean <= this.stats.std_dev) && this.stats.alert === true) {
      return false;
    } else {
      return null;
    }
  }

}
