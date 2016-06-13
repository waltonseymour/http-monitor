/// <reference path='blessed.d.ts' />
/// <reference path='blessed-contrib.d.ts' />
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';

const screen = blessed.screen();

let line;
let table;

let data = {
   x: [],
   y: []
};

export function graph() {
  var grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

  var donut = grid.set(8, 8, 4, 2, contrib.donut, {
    label: 'Percent Donut',
    radius: 16,
    arcWidth: 4,
    yPadding: 2,
    data: [{label: 'Storage', percent: 87}]
  });

  line = grid.set(0, 0, 8, 12, contrib.line, {
    style: {
      line: "yellow",
      text: "green",
      baseline: "black"
    }
  });

  table =  grid.set(8, 0, 4, 4, contrib.table, {
    keys: true,
    fg: 'blue',
    interactive: true,
    label: 'Alerts',
    columnSpacing: 1,
    columnWidth: [22, 22, 10]
  });

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });
  screen.render();
}

export function addData(x, y) {
  data.x = x;
  data.y = y;
  line.setData([data]);
  screen.render();
}

export function addAlert(added: Date, mean: number) {
  table.setData({
    headers: ['Timestamp Added', 'Timestamp Removed', 'Req / s'],
    data: [[added, '', mean]]
  });
  screen.render();
}
