/// <reference path='typings/index.d.ts' />
/// <reference path='node.d.ts' />
import { requestWindow } from './event';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Graph } from './graph';


export class Stats {
  alert: boolean = false;
  elapsed: number = 0;
  Ex: number = 0;
  Ex2: number = 0;
  mean: number = 0;
  std_dev: number = 0;

  update(point: number, onlyElapsed=false): void {
    this.elapsed++;
    if (onlyElapsed){ return; }
    this.Ex += point;
    this.Ex2 += point ** 2;
    // allows a rolling standard devation
    this.std_dev = ((this.Ex2 - (this.Ex ** 2)/ this.elapsed) / this.elapsed) ** 0.5;
    this.mean = this.Ex / this.elapsed;
  }

  checkAlert(graph: Graph): void {
    let windowMean = _.sum(requestWindow) / requestWindow.length;
    if ((windowMean - this.mean > this.std_dev) && this.alert === false){
      this.alert = true;
      graph.addAlert(moment().toDate(), windowMean);
      console.log('alert');
    }
    else if ((windowMean - this.mean < this.std_dev) && this.alert === true){
      this.alert = false;
      console.log('alert removed');
    }
  }

}
