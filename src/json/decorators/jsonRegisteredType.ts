import {Type} from "../../core";
import {JsonTypeName} from "../JsonTypeName";
import {registerType, RegisterTypeOptions} from "../registerType";

export function jsonRegisteredType(options?: RegisterTypeOptions) {
    return function(classType: Type & JsonTypeName) {
        registerType(classType, classType.jsonTypeName, options);
    }
}
