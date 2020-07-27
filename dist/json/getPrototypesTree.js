"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrototypesTree = void 0;
function getPrototypesTree(thiz) {
    var types = [];
    var prototype = Object.getPrototypeOf(thiz);
    while (prototype.constructor !== Object) {
        types.push(prototype);
        prototype = Object.getPrototypeOf(prototype);
    }
    return types;
}
exports.getPrototypesTree = getPrototypesTree;
