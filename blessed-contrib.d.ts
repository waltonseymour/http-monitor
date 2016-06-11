declare module 'blessed-contrib' {

    class chart {
      constructor(params: Object);
      setData(data: Object): void;
    }

    class donut extends chart {}

    class line extends chart {}

    class grid {
        constructor(data: Object);
        set(row, col, rowspan, colspan, widget, options: Object): chart;
    }
}
