/// <reference path='blessed.d.ts' />
/// <reference path='blessed-contrib.d.ts' />
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import * as moment from 'moment';

export class Graph {
  screen = blessed.screen();
  line: contrib.line;
  alerts: contrib.table;
  sections: contrib.table;
  grid: contrib.grid;
  requestdata = {
     x: [],
     y: []
  };

  alertData = [];

  constructor() {
    this.grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen});

    this.sections =  this.grid.set(8, 8, 4, 2, contrib.table, {
      label: 'Top Sections',
      columnSpacing: 1,
      columnWidth: [20, 15]
    });

    this.line = this.grid.set(0, 0, 8, 12, contrib.line, {
      style: {
        line: "yellow",
        text: "green",
        baseline: "black"
      }
    });

    this.alerts =  this.grid.set(8, 0, 4, 8, contrib.table, {
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
    this.alerts.setData({
      headers: ['Time Added', 'Time Removed', 'Req / s'],
      data: this.alertData
    });
    this.alerts.focus();
    this.screen.render();
  }

  removeAlert() {
    this.alertData[this.alertData.length - 1][1] = moment().toDate();
    this.alerts.setData({
      headers: ['Time Added', 'Time Removed', 'Req / s'],
      data: this.alertData
    });
    this.alerts.focus();
    this.screen.render();
  }

}
