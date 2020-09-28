"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonImpl = exports.toJsonImpl = void 0;
const core_1 = require("../core");
const findTypeSerializer_1 = require("./findTypeSerializer");
const getPrototypesTree_1 = require("./getPrototypesTree");
const identifyType_1 = require("./identifyType");
const Serializer_1 = require("./Serializer");
const serializers_1 = require("./serializers");
function toJsonImpl() {
    const prototypesTree = getPrototypesTree_1.getPrototypesTree(this);
    const typesTree = getTypesTree(prototypesTree);
    let json = {};
    // call toJSON for super types, only if hard coded in a class
    for (let t = 1; t < typesTree.length; t++) {
        if (!typesTree[t].__jsonToJson && prototypesTree[t].hasOwnProperty("toJSON")) {
            const prototypeJson = prototypesTree[t].toJSON.call(this);
            if (prototypeJson && typeof prototypeJson === "object") {
                json = prototypeJson;
            }
            break;
        }
    }
    const properties = getDeclaredProperties(this, typesTree);
    for (const propertyName in properties) {
        const config = properties[propertyName];
        const value = this[propertyName];
        if (value === undefined || typeof value === "function") {
            continue;
        }
        const type = config.propertyType ? config.propertyType : identifyType_1.identifyType(value);
        const serializer = type instanceof Serializer_1.Serializer ? type : findTypeSerializer_1.findTypeSerializer(type, typesTree[0].__jsonTypes);
        const name = config.propertyJsonName ? config.propertyJsonName : propertyName;
        if (serializer) {
            json[name] = serializer.serialize(value);
        }
        else {
            json[name] = new serializers_1.ObjectSerializer(type).serialize(value, { typeProviders: typesTree[0].__jsonTypes });
        }
    }
    if (typesTree[0].hasOwnProperty("jsonTypeName")) {
        json["@type"] = typesTree[0].jsonTypeName;
    }
    return json;
}
exports.toJsonImpl = toJsonImpl;
function fromJsonImpl(json) {
    const internalType = this;
    let instance;
    if (!instance && internalType.__jsonSubtypes) {
        for (const subtype of internalType.__jsonSubtypes) {
            let matchedType;
            if (subtype.matcher) {
                const match = subtype.matcher(json);
                if (match) {
                    matchedType = core_1.resolveForwardRef(match);
                }
            }
            else if (subtype.property && ((typeof subtype.value === "function" && subtype.value(json[subtype.property])) || (typeof subtype.value !== "function" && json[subtype.property] === subtype.value))) {
                matchedType = core_1.resolveForwardRef(subtype.type);
            }
            if (matchedType && matchedType !== this) {
                if (matchedType.hasOwnProperty("fromJSON")) {
                    return matchedType.fromJSON(json);
                }
                instance = new matchedType;
                break;
            }
        }
    }
    if (!instance) {
        instance = new this();
    }
    const prototypesTree = getPrototypesTree_1.getPrototypesTree(instance);
    const typesTree = getTypesTree(prototypesTree);
    const properties = getDeclaredProperties(instance, typesTree);
    // property names that already unserialized
    const unserializedProperties = [];
    // unserialize known properties
    for (const propertyName in properties) {
        const config = properties[propertyName];
        const name = config.propertyJsonName ? config.propertyJsonName : propertyName;
        if (name in json) {
            const value = json[name];
            if (typeof value === "function") {
                continue;
            }
            const type = config.propertyType ? config.propertyType : identifyType_1.identifyType(value);
            let serializer = type instanceof Serializer_1.Serializer ? type : findTypeSerializer_1.findTypeSerializer(type, typesTree[0].__jsonTypes);
            if (!serializer) {
                serializer = new serializers_1.ObjectSerializer(type);
            }
            instance[propertyName] = serializer.unserialize(value, { typeProviders: typesTree[0].__jsonTypes });
            unserializedProperties.push(name);
        }
    }
    // copy json properties, that were not unserialized above
    for (const propertyName in json) {
        if (propertyName === "@type" && typesTree[0].jsonTypeName) {
            continue;
        }
        if (unserializedProperties.indexOf(propertyName) < 0) {
            instance[propertyName] = serializers_1.ObjectSerializer.instance.unserialize(json[propertyName], { typeProviders: typesTree[0].__jsonTypes });
        }
    }
    return instance;
}
exports.fromJsonImpl = fromJsonImpl;
function getTypesTree(prototypes) {
    return prototypes.map(type => type.constructor);
}
function getDeclaredProperties(thiz, types) {
    let properties = {};
    for (let t = types.length - 1; t >= 0; t--) {
        const internalType = types[t];
        if (internalType.__jsonSerialization) {
            if (internalType.__jsonProperties) {
                properties = Object.assign(properties, internalType.__jsonProperties);
            }
            if (internalType.__jsonIgnoredProperties) {
                for (const propertyName of internalType.__jsonIgnoredProperties) {
                    delete properties[propertyName];
                }
            }
        }
    }
    return properties;
}
//# sourceMappingURL=toFromJsonImpl.js.map