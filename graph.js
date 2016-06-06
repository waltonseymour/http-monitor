const _ = require('underscore');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
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

module.exports = {
  graph: () => {
    screen.append(line); //must append before setting data
    line.setData([data]);

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
    screen.render();
  },

  addData: (x, y) => {
    data.x.push(x);
    data.y.push(y);
    line.setData([data]);
    screen.render();

  }

};
