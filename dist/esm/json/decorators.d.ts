import { SerializationOptions, Serializer } from "./serialization";
export declare function Subtype(property: string, value: any, typeRef: Function): (target: Function) => void;
export declare function Property(type: Function | Serializer): Function;
export declare function Property(type: Function | Serializer, jsonName?: string): Function;
export declare function Property(type: Function | Serializer, options?: SerializationOptions): Function;
export declare function Property(type: Function | Serializer, jsonName: string, options?: SerializationOptions): Function;
export declare function Ignore(target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor): void;
/**
 * Marks a class, that is to be serialized by json serialization engine.
 */
export declare function Serialize(target: Function): void;