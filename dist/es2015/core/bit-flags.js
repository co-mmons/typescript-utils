"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BitFlags {
    constructor(value) {
        this._value = value !== undefined ? value : 0;
    }
    get value() {
        return this._value;
    }
    has(flag) {
        return (this._value & flag) == flag;
    }
    not(flag) {
        return this.has(flag) == false;
    }
    add(flag) {
        return new BitFlags(this._value | flag);
    }
    remove(flag) {
        return new BitFlags(this._value & ~flag);
    }
    toggle(flag) {
        return new BitFlags(this._value ^ flag);
    }
}
exports.BitFlags = BitFlags;
class BitFlagsMutable extends BitFlags {
    constructor(value) {
        super(value);
    }
    add(flag) {
        this._value |= flag;
        return this;
    }
    remove(flag) {
        this._value &= ~flag;
        return this;
    }
    toggle(flag) {
        this._value ^= flag;
        return this;
    }
}
exports.BitFlagsMutable = BitFlagsMutable;
//# sourceMappingURL=bit-flags.js.map