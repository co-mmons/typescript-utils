"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectCollectionRxjs = void 0;
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var collection_impl_1 = require("../collection-impl");
var deep_clone_1 = require("../deep-clone");
var item_impl_1 = require("../item-impl");
var CollectionItemsObserver = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionItemsObserver, _super);
    function CollectionItemsObserver(collection) {
        var _this = _super.call(this, function (subscriber) { return _this.onSubscribe(subscriber); }) || this;
        _this.collection = collection;
        _this.subscribers = [];
        return _this;
    }
    CollectionItemsObserver.prototype.onSubscribe = function (subscriber) {
        var _this = this;
        this.collection.items().then(function (items) {
            subscriber.next(items);
            _this.subscribers.push(subscriber);
            if (!_this.unlisten) {
                _this.unlisten = _this.collection.listen(function (event) { return _this.listener(event); });
            }
        });
        return function () {
            var i = _this.subscribers.indexOf(subscriber);
            if (i > -1) {
                _this.subscribers.splice(i, 1);
            }
            if (_this.subscribers.length === 0 && _this.unlisten) {
                _this.unlisten();
            }
        };
    };
    CollectionItemsObserver.prototype.listener = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items, _i, _a, subscriber;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.collection.items()];
                    case 1:
                        items = _b.sent();
                        for (_i = 0, _a = this.subscribers; _i < _a.length; _i++) {
                            subscriber = _a[_i];
                            subscriber.next(items.slice()
                                .map(function (item) { return (item && new item_impl_1.PreferencesItemImpl(item.ref.collection, deep_clone_1.deepClone(item.key), deep_clone_1.deepClone(item.value))) || item; }));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return CollectionItemsObserver;
}(rxjs_1.Observable));
function injectCollectionRxjs() {
    collection_impl_1.PreferencesCollectionRefImpl.prototype.observeItems = function () {
        return new CollectionItemsObserver(this);
    };
    collection_impl_1.PreferencesCollectionRefImpl.prototype.observeValues = function () {
        return new CollectionItemsObserver(this).pipe(operators_1.map(function (items) { return items.map(function (item) { return item.value; }); }));
    };
}
exports.injectCollectionRxjs = injectCollectionRxjs;
//# sourceMappingURL=collection.js.map