import { Serializer } from "./serialization";
/**
 * Serializes enum as a String. By default enums are serialized as numbers.
 */
export class EnumAsStringSerializer extends Serializer {
    constructor(enumClass) {
        super();
        this.enumClass = enumClass;
    }
    serialize(value, options) {
        if (value !== undefined && value !== null) {
            return this.enumClass[value];
        }
        else {
            return undefined;
        }
    }
    unserialize(value, options) {
        if (value && typeof value === "string") {
            return this.enumClass[value];
        }
        else {
            return undefined;
        }
    }
}
//# sourceMappingURL=enum-serializer.js.map