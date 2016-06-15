/// <reference path='../typings/index.d.ts' />
/// <reference path='../node.d.ts' />
import * as moment from 'moment';
import * as _ from 'lodash';

import { EventProcessor } from './event';

export class Stats {
  startTime: Date;
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
    update: Takes in a data-point equivalent to requests in a given second.
    Modifies elapsed, mean, and standard_deviation using
    a rolling formula, preventing the need to keep track of historical data.
    Also allows for elapsed to be updated without others being modified.
  */
  updateHistorical(point: number): void {

  }


}
