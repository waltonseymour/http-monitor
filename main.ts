/// <reference path='typings/index.d.ts' />
/// <reference path='node.d.ts' />

import * as moment from 'moment';
import * as _ from 'lodash';
import { Watcher } from './watch';
import { Graph } from './graph';
import { WINDOW_SIZE, requestWindow } from './event';
import { Stats } from './stats';

let watcher = new Watcher('test.log');
watcher.watch();
let graph = new Graph();
const stats = new Stats();

//should be in a seperate file
setInterval(() => {
  graph.addData(_.map(Array(WINDOW_SIZE),(x,i) => {
      return (WINDOW_SIZE - i) + 's';
  }), requestWindow);
  let point: number = requestWindow.shift();
  requestWindow.push(0);
  stats.update(point, stats.elapsed < WINDOW_SIZE);
  if (stats.elapsed > WINDOW_SIZE * 1.5){
    stats.checkAlert(graph);
  }
}, 1000);
