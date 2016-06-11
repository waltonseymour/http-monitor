declare module 'blessed-contrib' {

    class chart {
      constructor(params: Object);
      setData(data: Object): void;
    }

    class donut extends chart {}

    class line extends chart {}

    class grid {
        constructor(data: Object);
        set(x1, x2, y1, y2, widget, options: Object): chart;
    }
}
