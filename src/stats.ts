/// <reference path='../typings/index.d.ts' />
/// <reference path='../node.d.ts' />
import * as moment from 'moment';
import * as _ from 'lodash';
import { Graph } from './graph';
import { EventProcessor } from './event';

export class Stats {
  alert: boolean = false;
  elapsed: number = 0;
  //Ex = Σx
  Ex: number = 0;
  //Ex2 = Σ(x^2)
  Ex2: number = 0;
  mean: number = 0;
  std_dev: number = 0;

  /*
    update: Takes in a data-point equivalent to requests in a given second.
    Modifies elapsed, mean, and standard_deviation using
    a rolling formula, preventing the need to keep track of historical data.
    Also allows for elapsed to be updated without others being modified.
  */
  update(point: number, onlyElapsed=false): void {
    this.elapsed++;
    if (onlyElapsed){ return; }
    this.Ex += point;
    this.Ex2 += point ** 2;
    this.std_dev = ((this.Ex2 - (this.Ex ** 2)/ this.elapsed) / this.elapsed) ** 0.5;
    this.mean = this.Ex / this.elapsed;
  }

  /*
    checkAlert: Takes in a graph object and will add or remove alert to graph
    if the window mean exceeds the eternity mean by more than a standard_deviation.
    Uses a boolean variable 'alert' to maintain state.
  */
  checkAlert(graph: Graph, processor: EventProcessor): void {
    let windowMean = _.sum(processor.requestWindow) / processor.requestWindow.length;
    if ((windowMean - this.mean > this.std_dev) && this.alert === false) {
      this.alert = true;
      graph.addAlert(moment().toDate(), windowMean);
    }
    else if ((windowMean - this.mean <= this.std_dev) && this.alert === true) {
      this.alert = false;
      graph.removeAlert();
    }
  }

}
