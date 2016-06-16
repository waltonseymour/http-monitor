/// <reference path='../typings/index.d.ts' />
/// <reference path='../node.d.ts' />

import * as moment from 'moment';
import * as _ from 'lodash';
import { Watcher } from './watch';
import { Graph } from './graph';
import { EventProcessor } from './eventProcessor';
import { Stats } from './stats';

const graph = new Graph();
const stats = new Stats();
const processor = new EventProcessor(stats, graph);
const watcher = new Watcher('test.log', processor);
const xAxis = _.map(Array(processor.WINDOW_SIZE), (x,i) => {
  return (processor.WINDOW_SIZE - i) + 's';
});

// Begins polling
watcher.watch();

setInterval(() => {
  updateAll();
}, 1000);

function updateAll(): void {
  graph.addData(xAxis, processor.requestWindow);
  let point: number = processor.requestWindow.shift();
  processor.requestWindow.push(0);
  stats.update(point);
  if (stats.elapsed > processor.WINDOW_SIZE * 1.5) {
    processor.checkAlert();
  }
}
