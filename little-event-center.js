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
            if (eventList[eventName]) {
                i = 0;
                l = eventList[eventName].length;
                for (; i < l; i ++) {
                    // 有可能执行过程中，通过 off 删除了某个事件对应的方法
                    if (l > eventList[eventName].length) {
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
                    // 有可能执行过程中，通过 off 删除了某个事件对应的方法
                    if (l > eventOnceList[eventName].length) {
                        i --;
                        l = eventOnceList[eventName].length;
                    }
                    eventOnceList[eventName][i].call(this, data);
                    _off(eventName, eventOnceList[eventName][i], true);
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