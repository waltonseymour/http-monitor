/// <reference path='blessed.d.ts' />
/// <reference path='blessed-contrib.d.ts' />
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';

const screen = blessed.screen();

let line;

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
