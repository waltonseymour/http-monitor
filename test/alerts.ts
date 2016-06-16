/// <reference path='../typings/index.d.ts' />
/// <reference path='../node.d.ts' />

import * as _ from 'lodash';
import * as moment from 'moment';
import { assert } from 'chai';
import { appendFile } from 'fs';
import { Watcher } from '../src/watch';
import { Graph } from '../src/graph';
import { EventProcessor } from '../src/eventProcessor';
import { Stats } from '../src/stats';

describe('Alerts', () => {
  let stats: Stats;
  let processor: EventProcessor;
  let watcher: Watcher;

  before((done) => {
    stats = new Stats();
    processor = new EventProcessor(stats, 5);
    // adds 100 requests at P(0.3) every 10ms to file before test
    let n = 0;
    let id = setInterval(() => {
      let timestamp = moment().format('DD/MMM/YYYY:HH:mm:ss Z');
      let line = '127.0.0.1 user-identifier frank ['+timestamp+'] "GET /testing/apache_pb.gif HTTP/1.0" 200 2326' + '\n';
      if (n === 100){
        done();
        clearInterval(id);
      }
      if (Math.random() > 0.7) {
        appendFile('test.log', line, (err) => {
          if (err) throw err;
          n++;
        });
      }
    }, 10);

  });

  it('should alert when traffic rises', (done) =>{
    watcher = new Watcher('test.log', processor);
    watcher.watch();
    let n = 0;
    let alert = false;

    let id = setInterval(() => {
      let timestamp = moment().format('DD/MMM/YYYY:HH:mm:ss Z');
      let line = '127.0.0.1 user-identifier frank ['+timestamp+'] "GET /testing/apache_pb.gif HTTP/1.0" 200 2326' + '\n';
      if (n === 200 || alert === true) {
        assert(alert === true, 'alert is signaled');
        done();
        clearInterval(id);
      }
      if (Math.random() > 0.3) {
        appendFile('test.log', line, (err) => {
          if (err) throw err;
          n++;
          alert = processor.checkAlert() || alert;
        });
      }
    }, 10);

    setInterval(() => {
      let point: number = processor.requestWindow.shift();
      processor.requestWindow.push(0);
      stats.update(point);
    }, 1000);
  });
});
