"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySerializer = void 0;
const core_1 = require("../../core");
const Serializer_1 = require("../Serializer");
const ObjectSerializer_1 = require("./ObjectSerializer");
class ArraySerializer extends Serializer_1.Serializer {
    constructor(valueTypeOrSerializer) {
        super();
        if (arguments.length == 1 && !valueTypeOrSerializer) {
            throw new Error("Value type passed to Json Array Serializer is undefined - check, whether class reference cycle");
        }
        if (valueTypeOrSerializer) {
            this.typeOrSerializer = core_1.resolveForwardRef(valueTypeOrSerializer);
        }
    }
    serialize(value, options) {
        if (this.isUndefinedOrNull(value)) {
            return this.serializeUndefinedOrNull(value, options);
        }
        else if (Array.isArray(value)) {
            const array = [];
            const serializer = this.typeOrSerializer instanceof Serializer_1.Serializer ? this.typeOrSerializer : (this.typeOrSerializer && ObjectSerializer_1.ObjectSerializer.getTypeSerializer(this.typeOrSerializer, options === null || options === void 0 ? void 0 : options.typeProviders)) || ObjectSerializer_1.ObjectSerializer.instance;
            for (const i of value) {
                array.push(serializer.serialize(i, options));
            }
            return array;
        }
        else if (!options || !options.ignoreErrors) {
            throw new Error(`Cannot serialize "${value}" as array`);
        }
        else {
            return undefined;
        }
    }
    unserialize(json, options) {
        if (Array.isArray(json)) {
            const array = [];
            const serializer = this.typeOrSerializer instanceof Serializer_1.Serializer ? this.typeOrSerializer : (this.typeOrSerializer && ObjectSerializer_1.ObjectSerializer.getTypeSerializer(this.typeOrSerializer, options === null || options === void 0 ? void 0 : options.typeProviders)) || ObjectSerializer_1.ObjectSerializer.instance;
            for (const i of json) {
                array.push(serializer.unserialize(i, options));
            }
            return array;
        }
        else if (this.isUndefinedOrNull(json)) {
            return this.unserializeUndefinedOrNull(json, options);
        }
        else if (!options || !options.ignoreErrors) {
            throw new Error(`Cannot unserialize "${json}" to array`);
        }
        else {
            return undefined;
        }
    }
}
exports.ArraySerializer = ArraySerializer;
(function (ArraySerializer) {
    ArraySerializer.ofAny = new ArraySerializer();
    ArraySerializer.ofString = new ArraySerializer(String);
    ArraySerializer.ofNumber = new ArraySerializer(Number);
    ArraySerializer.ofBoolean = new ArraySerializer(Boolean);
})(ArraySerializer = exports.ArraySerializer || (exports.ArraySerializer = {}));
//# sourceMappingURL=ArraySerializer.js.map