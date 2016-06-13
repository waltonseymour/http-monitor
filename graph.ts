/// <reference path='blessed.d.ts' />
/// <reference path='blessed-contrib.d.ts' />
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';

export class Graph {
  screen = blessed.screen();
  line: contrib.chart;
  table: contrib.chart;
  donut: contrib.chart;
  grid: contrib.grid;
  data = {
     x: [],
     y: []
  };

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

    this.table =  this.grid.set(8, 0, 4, 4, contrib.table, {
      keys: true,
      fg: 'blue',
      interactive: true,
      label: 'Alerts',
      columnSpacing: 1,
      columnWidth: [22, 22, 10]
    });

    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    this.screen.render();
  }

  addData(x, y) {
    this.data.x = x;
    this.data.y = y;
    this.line.setData([this.data]);
    this.screen.render();
  }

  addAlert(added: Date, mean: number) {
    this.table.setData({
      headers: ['Timestamp Added', 'Timestamp Removed', 'Req / s'],
      data: [[added, '', mean]]
    });
    this.screen.render();
  }

}
