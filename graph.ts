/// <reference path='blessed.d.ts' />
/// <reference path='blessed-contrib.d.ts' />
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import * as moment from 'moment';

export class Graph {
  screen = blessed.screen();
  line: contrib.line;
  table: contrib.table;
  donut: contrib.donut;
  grid: contrib.grid;
  requestdata = {
     x: [],
     y: []
  };

  alertData = [];

  constructor() {
    this.grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen});

    this.donut = this.grid.set(8, 8, 4, 2, contrib.donut, {
      label: 'Percent Donut',
      radius: 16,
      arcWidth: 4,
      yPadding: 2,
      data: [{label: 'Storage', percent: 87}]
    });

    this.line = this.grid.set(0, 0, 8, 12, contrib.line, {
      style: {
        line: "yellow",
        text: "green",
        baseline: "black"
      }
    });

    this.table =  this.grid.set(8, 0, 4, 8, contrib.table, {
      keys: true,
      interactive: true,
      fg: 'blue',
      label: 'Alerts',
      columnSpacing: 1,
      columnWidth: [45, 45, 10]
    });

    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    this.screen.render();
  }

  addData(x, y) {
    this.requestdata.x = x;
    this.requestdata.y = y;
    this.line.setData([this.requestdata]);
    this.screen.render();
  }

  addAlert(added: Date, mean: number) {
    this.alertData.push([added, '', mean]);
    this.table.setData({
      headers: ['Time Added', 'Time Removed', 'Req / s'],
      data: this.alertData
    });
    this.table.focus();
    this.screen.render();
  }

  removeAlert() {
    this.alertData[this.alertData.length - 1][1] = moment().toDate();
    this.table.setData({
      headers: ['Time Added', 'Time Removed', 'Req / s'],
      data: this.alertData
    });
    this.table.focus();
    this.screen.render();
  }

}
