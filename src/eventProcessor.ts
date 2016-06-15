import * as moment from 'moment';
import * as _ from 'lodash';
import { Event } from './event';
import { Stats } from './stats';
import { Graph } from './graph';

export class EventProcessor {
  WINDOW_SIZE: number = 120;
  requestWindow: Array<number> = _.fill(Array(this.WINDOW_SIZE), 0);
  sectionTraffic: Object = {};
  stats: Stats;
  graph: Graph;

  constructor(stats: Stats, graph: Graph){
    this.stats = stats;
    this.graph = graph;
  }

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
    It then increments stats as needed.
  */
  // processHistorical(line: string): void {
  //   const event = new Event(line);
  //
  //   if (!this.sectionTraffic[event.section]) {
  //     this.sectionTraffic[event.section] = 1;
  //   }
  //   else {
  //     this.sectionTraffic[event.section]++;
  //   }
  //   this.requestWindow[this.requestWindow.length - 1]++;
  // }

  /*
    checkAlert: Will add or remove alert to graph if the window mean exceeds
    the eternity mean by more than a standard_deviation.
    Uses a boolean variable 'alert' to maintain state.
  */
  checkAlert(): void {
    let windowMean = _.sum(this.requestWindow) / this.requestWindow.length;
    if ((windowMean - this.stats.mean > this.stats.std_dev) && this.stats.alert === false) {
      this.stats.alert = true;
      this.graph.addAlert(moment().toDate(), windowMean);
    }
    else if ((windowMean - this.stats.mean <= this.stats.std_dev) && this.stats.alert === true) {
      this.stats.alert = false;
      this.graph.removeAlert();
    }
  }

}
