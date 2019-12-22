import { deepEqual } from "fast-equals";
import { PreferencesCollectionRefImpl } from "./collection-impl";
import { deepClone } from "./deep-clone";
export class MemoryPreferencesContainer {
    constructor() {
        this.itemsArray = [];
    }
    changed(collection, key, operation) {
    }
    set(collection, key, value, options) {
        let item = this.itemsArray.find(item => item.collection === collection && deepEqual(item.key, key));
        if (item) {
            item.value = options && options.merge ? Object.assign({}, item.value, value) : deepClone(value);
            this.changed(collection, key, "update");
            return Promise.resolve(deepClone(item));
        }
        else {
            item = { collection: collection, key: deepClone(key), value: deepClone(value) };
            this.itemsArray.push(item);
            this.changed(collection, key, "new");
            return Promise.resolve(deepClone(item));
        }
    }
    get(collection, key) {
        const item = this.itemsArray.find(item => item.collection === collection && deepEqual(item.key, key));
        return Promise.resolve((item && deepClone(item)) || null);
    }
    delete(collection, keysOrFilter) {
        const deleted = [];
        if (Array.isArray(keysOrFilter)) {
            KEYS: for (const key of keysOrFilter) {
                for (let i = 0; i < this.itemsArray.length; i++) {
                    if (this.itemsArray[i].collection === collection && deepEqual(this.itemsArray[i].key, key)) {
                        for (const item of this.itemsArray.splice(i, 1)) {
                            this.changed(collection, item.key, "delete");
                            deleted.push(deepClone(item));
                        }
                        continue KEYS;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.itemsArray.length; i++) {
                if (this.itemsArray[i].collection === collection && (!keysOrFilter || keysOrFilter(this.itemsArray[i].key, this.itemsArray[i].value))) {
                    for (const item of this.itemsArray.splice(i, 1)) {
                        this.changed(collection, item.key, "delete");
                        deleted.push(deepClone(item));
                    }
                }
            }
        }
        return Promise.resolve(deleted);
    }
    exists(collection, key) {
        return Promise.resolve(!!this.itemsArray.find(item => item.collection === collection && deepEqual(item.key, key)));
    }
    items(collection, keysOrFilter) {
        const items = [];
        if (Array.isArray(keysOrFilter)) {
            KEYS: for (const key of keysOrFilter) {
                for (const item of this.itemsArray) {
                    if (item.collection === collection && deepEqual(item.key, key)) {
                        items.push(deepClone(item));
                        continue KEYS;
                    }
                }
            }
        }
        else {
            for (const item of this.itemsArray) {
                if (item.collection === collection && (!keysOrFilter || keysOrFilter(item.key, item.value))) {
                    items.push(deepClone(item));
                }
            }
        }
        return Promise.resolve(items);
    }
    update(collection, key, changes) {
        const item = this.itemsArray.find(item => item.collection === collection && deepEqual(item.key, key));
        if (item) {
            if (changes) {
                item.value = Object.assign({}, item.value, changes);
                this.changed(collection, item.key, "update");
            }
            return Promise.resolve(deepClone(item));
        }
        else {
            return Promise.reject(new Error("Key not exists"));
        }
    }
    collection(name) {
        return new PreferencesCollectionRefImpl(this, name);
    }
}
//# sourceMappingURL=memory-container.js.map