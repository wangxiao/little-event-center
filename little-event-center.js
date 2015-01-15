// 小型的私有事件中心
var eventCenter = function() {
    var eventList = {};
    var eventOnceList = {};
    return {
        _on: function(eventName, fun, isOnce) {
            if (!eventName) {
                tool.error('No event name.');
            }
            else if (!fun) {
                tool.error('No callback function.');
            }

            if (!isOnce) {
                if (!eventList[eventName]) {
                    eventList[eventName] = [];
                }
                eventList[eventName].push(fun);
            }
            else {
                if (!eventOnceList[eventName]) {
                    eventOnceList[eventName] = [];
                }
                eventOnceList[eventName].push(fun);
            }
        },
        on: function(eventName, fun) {
            this._on(eventName, fun);
        },
        once: function(eventName, fun) {
            this._on(eventName, fun, true);
        },
        emit: function(eventName, data) {
            if (!eventName) {
                tool.error('No emit event name.');
            }
            var i = 0;
            var l = 0;
            if (eventList[eventName]) {
                i = 0;
                l = eventList[eventName].length;
                for (; i < l; i ++) {
                    // 有可能执行过程中，删除了某个事件对应的方法
                    if (l < eventList[eventName].length) {
                        i --;
                        l = eventList[eventName].length;
                    }
                    eventList[eventName][i].call(this, data);
                }
            }
            if (eventOnceList[eventName]) {
                i = 0;
                l = eventOnceList[eventName].length;
                for (; i < l; i ++) {
                    // 有可能执行过程中，删除了某个事件对应的方法
                    if (l < eventOnceList[eventName].length) {
                        i --;
                        l = eventOnceList[eventName].length;
                    }
                    eventOnceList[eventName][i].call(this, data);
                }
            }
        },
        remove: function(eventName, fun) {
            if (eventList[eventName]) {
                var i = 0;
                var l = eventList[eventName].length;
                for (; i < l; i ++) {
                    if (eventList[eventName][i] === fun) {
                        eventList[eventName].splice(i, 1);
                    }
                }
            }
        }
    };
};