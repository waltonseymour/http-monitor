/// <reference path='../typings/index.d.ts' />
/// <reference path='../node.d.ts' />

import * as moment from 'moment';
import * as _ from 'lodash';
import { Watcher } from './watch';
import { Graph } from './graph';
import { WINDOW_SIZE, requestWindow } from './event';
import { Stats } from './stats';

const watcher = new Watcher('test.log');
const graph = new Graph();
const stats = new Stats();
const xAxis = _.map(Array(WINDOW_SIZE), (x,i) => {
  return (WINDOW_SIZE - i) + 's';
});

watcher.watch();

setInterval(() => {
  graph.addData(xAxis, requestWindow);
  let point: number = requestWindow.shift();
  requestWindow.push(0);
  stats.update(point, stats.elapsed < WINDOW_SIZE);
  if (stats.elapsed > WINDOW_SIZE * 1.5){
    stats.checkAlert(graph);
  }
}, 1000);
