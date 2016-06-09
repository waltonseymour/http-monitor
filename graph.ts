/// <reference path='blessed.d.ts' />
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';

const screen = blessed.screen();

const line = contrib.line({
  style: {
    line: "blue",
    text: "yellow",
    baseline: "white"
  }
});

var data = {
   x: [],
   y: []
};

export function graph() {
  screen.append(line); //must append before setting data
  line.setData([data]);

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
