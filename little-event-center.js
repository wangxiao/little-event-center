var eventCenter = function() {
    var eventList = {};
    var eventOnceList = {};

    var _on = function(eventName, fun, isOnce) {
        if (!eventName) {
            throw('No event name.');
        }
        else if (!fun) {
            throw('No callback function.');
        }
        var list = eventName.split(/\s+/);
        var tempList;
        if (!isOnce) {
            tempList = eventList;
        } 
        else {
            tempList = eventOnceList;
        }
        for (var i = 0, l = list.length; i < l; i ++) {
            if (list[i]) {
                if (!tempList[list[i]]) {
                    tempList[list[i]] = [];
                }
                tempList[list[i]].push(fun);
            }
        }
    };
    
    var _off = function(eventName, fun, isOnce) {
        var tempList;
        if (!isOnce) {
            tempList = eventList;
        } else {
            tempList = eventOnceList;
        }
        if (tempList[eventName]) {
            var i = 0;
            var l = tempList[eventName].length;
            for (; i < l; i ++) {
                if (tempList[eventName][i] === fun) {
                    tempList[eventName].splice(i, 1);
                    // 每次只清除掉一个
                    return;
                }
            }
        }
    };

    return {
        on: function(eventName, fun) {
            _on(eventName, fun);
            return this;
        },
        once: function(eventName, fun) {
            _on(eventName, fun, true);
            return this;
        },
        emit: function(eventName, data) {
            if (!eventName) {
                throw('No emit event name.');
            }
            var i = 0;
            var l = 0;
            var listeners;
            if (eventList[eventName]) {
                // 有可能执行过程中，通过 off 删除了某个事件对应的方法，这里先复制一份出来
                listeners = eventList[eventName].slice();
                i = 0;
                l = listeners.length;
                for (; i < l; i ++) {
                    listeners[i].call(this, data);
                }
            }
            if (eventOnceList[eventName]) {
                // 有可能执行过程中，通过 off 删除了某个事件对应的方法，这里先复制一份出来
                listeners = eventOnceList[eventName].slice();
                i = 0;
                l = listeners.length;
                for (; i < l; i ++) {
                    listeners[i].call(this, data);
                    _off(eventName, listeners[i], true);
                }
            }
            return this;
        },
        off: function(eventName, fun) {
            _off(eventName, fun);
            return this;
        }
    };
};