"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSerializer = void 0;
const findTypeSerializer_1 = require("../findTypeSerializer");
const serializeImpl_1 = require("../serializeImpl");
const Serializer_1 = require("../Serializer");
const unserializeImpl_1 = require("../unserializeImpl");
/**
 * Basic serializer.
 */
class ObjectSerializer extends Serializer_1.Serializer {
    constructor(type) {
        super();
        if (type && type !== Object && type !== Array) {
            this.type = type;
        }
    }
    serialize(object, options) {
        return serializeImpl_1.serializeImpl(object, this.type, options);
    }
    unserialize(json, options) {
        return unserializeImpl_1.unserializeImpl(json, (this.type && findTypeSerializer_1.findTypeSerializer(this.type, options === null || options === void 0 ? void 0 : options.typeProviders)) || this.type, options);
    }
}
exports.ObjectSerializer = ObjectSerializer;
(function (ObjectSerializer) {
    ObjectSerializer.instance = new ObjectSerializer();
    function getTypeSerializer(type, typeProviders) {
        const serializer = findTypeSerializer_1.findTypeSerializer(type, typeProviders);
        if (serializer) {
            return serializer;
        }
        else {
            return new ObjectSerializer(type);
        }
    }
    ObjectSerializer.getTypeSerializer = getTypeSerializer;
})(ObjectSerializer = exports.ObjectSerializer || (exports.ObjectSerializer = {}));
//# sourceMappingURL=ObjectSerializer.js.map