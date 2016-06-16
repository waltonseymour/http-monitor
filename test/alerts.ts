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
  before((done) => {
    const stats = new Stats();
    const processor = new EventProcessor(stats);
    const watcher = new Watcher('test.log', processor);
    const xAxis = _.map(Array(processor.WINDOW_SIZE), (x, i) => {
      return (processor.WINDOW_SIZE - i) + 's';
    });
    
    let n = 0;
    let id = setInterval(() => {
      let timestamp = moment().format('DD/MMM/YYYY:HH:mm:ss Z');
      let line = '127.0.0.1 user-identifier frank ['+timestamp+'] "GET /testing/apache_pb.gif HTTP/1.0" 200 2326' + '\n';
      if (n === 100) done();
      if (Math.random() > 0.7) {
        appendFile('test.log', line, (err) => {
          if (err) throw err;
          n++;
        });
      }
    }, 10);

  });


  it('shoud something', () =>{


    assert(1 === 1);
  });
});
