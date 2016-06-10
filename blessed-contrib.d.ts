declare module 'blessed-contrib' {
    function line(params: Object): Line;

    export interface Line {
        setData(data: Object): void;
    }
}
