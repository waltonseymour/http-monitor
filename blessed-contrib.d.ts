declare module 'blessed-contrib' {

    export class chart {
      constructor(params: Object);
      setData(data: Object): void;
    }

    class donut extends chart {}

    class line extends chart {}
    class table extends chart {
      focus(): void;
    }

    class grid {
        constructor(data: Object);
        set(row, col, rowspan, colspan, widget, options: Object);
    }
}
