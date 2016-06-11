declare module 'blessed' {
    function screen(): BlessedScreen;

    export interface BlessedScreen {
        render(): void;
        append(BlessedElement): void;
        remove(BlessedElement): void;
        enableKeys(): void;
        key(params: Array<string>, callback: Function): void;
    }
}
