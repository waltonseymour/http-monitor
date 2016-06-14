/// <reference path='../typings/index.d.ts' />
/// <reference path='../node.d.ts' />

import * as moment from 'moment';
import * as _ from 'lodash';
import { Watcher } from './watch';
import { Graph } from './graph';
import { EventProcessor } from './event';
import { Stats } from './stats';

const watcher = new Watcher('test.log');
const graph = new Graph();
const stats = new Stats();
const proccessor = new EventProcessor();
const xAxis = _.map(Array(proccessor.WINDOW_SIZE), (x,i) => {
  return (proccessor.WINDOW_SIZE - i) + 's';
});

watcher.watch(proccessor);

setInterval(() => {
  graph.addData(xAxis, proccessor.requestWindow);
  let point: number = proccessor.requestWindow.shift();
  proccessor.requestWindow.push(0);
  stats.update(point, stats.elapsed < proccessor.WINDOW_SIZE);
  if (stats.elapsed > proccessor.WINDOW_SIZE * 1.5){
    stats.checkAlert(graph, proccessor);
  }
}, 1000);
