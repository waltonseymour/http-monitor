/// <reference path='../blessed.d.ts' />
/// <reference path='../blessed-contrib.d.ts' />
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import * as moment from 'moment';
import * as _ from 'lodash';

export class Graph {
  screen = blessed.screen();
  line: contrib.line;
  alerts: contrib.table;
  sections: contrib.table;
  donut: contrib.donut;
  grid: contrib.grid;
  requestData = {
     x: [],
     y: []
  };
  alertData = [];

  constructor() {
    this.grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen});
    this.sections =  this.grid.set(8, 8, 4, 4, contrib.table, {
      label: 'Top Sections',
      interactive: false,
      bg: 'black',
      fg: 'green',
      columnWidth: [10, 7]
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
    this.requestData.x = x;
    this.requestData.y = y;
    this.line.setData([this.requestData]);
    this.screen.render();
  }

  addSectionData(data) {
    let newData =_.map(data, (value, key) => {
      return [key, value];
    });
    newData = newData.sort((a, b) => {
      if (a[1] === b[1]) {
        return 0;
      } else {
        return (a[1] < b[1]) ? -1 : 1;
      }
    });
    this.sections.setData({
      headers: ['Section', 'Req'],
      data: newData
    });
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
