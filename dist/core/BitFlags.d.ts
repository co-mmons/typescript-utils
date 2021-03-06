export declare class BitFlags {
    constructor(value?: number);
    protected _value: number;
    get value(): number;
    has(flag: number): boolean;
    not(flag: number): boolean;
    add(flag: number): BitFlags;
    remove(flag: number): BitFlags;
    toggle(flag: number): BitFlags;
}
