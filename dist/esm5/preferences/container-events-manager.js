var ContainerEventsManager = /** @class */ (function () {
    function ContainerEventsManager() {
        this.listeners = [];
    }
    ContainerEventsManager.prototype.addListener = function (listener, collection) {
        var _this = this;
        this.listeners.push({ listener: listener, collection: collection });
        return function () {
            for (var i = _this.listeners.length - 1; i >= 0; i--) {
                if (_this.listeners[i].listener === listener && ((!_this.listeners[i].collection && !collection) || (_this.listeners[i].collection === collection))) {
                    _this.listeners.splice(i, 1);
                }
            }
        };
    };
    ContainerEventsManager.prototype.fireEvent = function (event) {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            if (!listener.collection || event.collection === listener.collection) {
                try {
                    listener.listener(event);
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    };
    return ContainerEventsManager;
}());
export { ContainerEventsManager };
//# sourceMappingURL=container-events-manager.js.map