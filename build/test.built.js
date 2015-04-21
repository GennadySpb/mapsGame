require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dispatcher = require('../utils/dispatcher');

module.exports = {

    /**
     * Обновление геобъектов
     * @param {Array} data
     */
    updateGeoObject: function (data) {
        dispatcher.trigger('updateGeobjects', data);
    },

    /**
     * Запускаем игру
     */
    play: function () {
        dispatcher.trigger('play');
    },

    /**
     * Обхект найден
     * @param {Number} points - очки
     */
    answer: function (points) {
        dispatcher.trigger('addPoints', points);
    },

    /**
     * Использовать подсказку
     * @param {Number} cost
     */
    useHint: function (cost) {
        dispatcher.trigger('hint', cost);
    },

    /**
     * Конец игры
     */
    endGame: function () {
        dispatcher.trigger('endGame');
    },

    /**
     * Показываем результат игры
     * @param {Object} data
     */
    showResult: function (data) {
        dispatcher.trigger('showResult', data);
    },

    /**
     * Обновляем очки
     *
     * @param {Number} points
     */
    updatePoints: function (points) {
        dispatcher.trigger('updatePoints', points);
    },

    /**
     * Время игры кончилось
     */
    timeout: function () {
        dispatcher.trigger('timeout');
    }
};


},{"../utils/dispatcher":5}],2:[function(require,module,exports){
/* global describe, before, after, it */
var expect = require('chai').expect;
var appActions = require('../../actions/AppActions');
var dispatcher = require('../../utils/dispatcher');

describe('Actions', function () {
    describe('app', function () {
        it('updateGeoObject trigger updateGeobjects', function (done) {
            var data = { test: 1 };
            dispatcher.on('updateGeobjects', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.updateGeoObject(data);
        });

        it('play trigger play', function (done) {
            dispatcher.on('play', function (actual) {
                expect(actual).to.be.undefined;
                done();
            });

            appActions.play();
        });

        it('answer trigger addPoints', function (done) {
            var data = 1;

            dispatcher.on('addPoints', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.answer(data);
        });

        it('useHint trigger hint', function (done) {
            var data = 1;

            dispatcher.on('hint', function (actual) {
                expect(actual).to.eql(data);
                //done();
            });

            appActions.useHint(data);
        });

        it('endGame trigger endGame', function (done) {
            dispatcher.on('endGame', function (actual) {
                expect(actual).to.be.undefined;
                done();
            });

            appActions.endGame();
        });

        it('showResult trigger showResult', function (done) {
            var data = { test: 1 };

            dispatcher.on('showResult', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.showResult(data);
        });

        it('updatePoints trigger updatePoints', function (done) {
            var data = 1;

            dispatcher.on('updatePoints', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.updatePoints(data);
        });

        it('timeout trigger timeout', function (done) {
            dispatcher.on('timeout', function (actual) {
                expect(actual).to.be.undefined;
                done();
            });

            appActions.timeout();
        });
    });
});



},{"../../actions/AppActions":1,"../../utils/dispatcher":5,"chai":"chai"}],3:[function(require,module,exports){
window.config = {
    env: 'development'
};

// список тестов, который нужно пройти
require('./actions/index');


},{"./actions/index":2}],4:[function(require,module,exports){
//http://backbonejs.org/#Events
var Events = {};

// Regular expression used to split event strings.
var eventSplitter = /\s+/;

// Iterates over the standard `event, callback` (as well as the fancy multiple
// space-separated events `"change blur", callback` and jQuery-style event
// maps `{event: callback}`), reducing them by manipulating `events`.
// Passes a normalized (single event name and callback), as well as the `context`
// and `ctx` arguments to `iteratee`.
var eventsApi = function(iteratee, memo, name, callback, context, ctx) {
    var i = 0, names, length;
    if (name && typeof name === 'object') {
        // Handle event maps.
        for (names = _.keys(name); i < names.length; i++) {
            memo = iteratee(memo, names[i], name[names[i]], context, ctx);
        }
    } else if (name && eventSplitter.test(name)) {
        // Handle space separated event names.
        for (names = name.split(eventSplitter); i < names.length; i++) {
            memo = iteratee(memo, names[i], callback, context, ctx);
        }
    } else {
        memo = iteratee(memo, name, callback, context, ctx);
    }
    return memo;
};

// Bind an event to a `callback` function. Passing `"all"` will bind
// the callback to all events fired.
Events.on = function(name, callback, context) {
    this._events = eventsApi(onApi, this._events || {}, name, callback, context, this);
    return this;
};

// Inversion-of-control versions of `on`. Tell *this* object to listen to
// an event in another object... keeping track of what it's listening to.
Events.listenTo =  function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
        listening = listeningTo[id] = {obj: obj, events: {}};
        id = this._listenId || (this._listenId = _.uniqueId('l'));
        var listeners = obj._listeners || (obj._listeners = {});
        listeners[id] = this;
    }

    // Bind callbacks on obj, and keep track of them on listening.
    obj.on(name, callback, this);
    listening.events = eventsApi(onApi, listening.events, name, callback);
    return this;
};

// The reducing API that adds a callback to the `events` object.
var onApi = function(events, name, callback, context, ctx) {
    if (callback) {
        var handlers = events[name] || (events[name] = []);
        handlers.push({callback: callback, context: context, ctx: context || ctx});
    }
    return events;
};

// Remove one or many callbacks. If `context` is null, removes all
// callbacks with that function. If `callback` is null, removes all
// callbacks for the event. If `name` is null, removes all bound
// callbacks for all events.
Events.off =  function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, context);

    var listeners = this._listeners;
    if (listeners) {
        // Listeners always bind themselves as the context, so if `context`
        // is passed, narrow down the search to just that listener.
        var ids = context != null ? [context._listenId] : _.keys(listeners);

        for (var i = 0; i < ids.length; i++) {
            var listener = listeners[ids[i]];

            // Bail out if listener isn't listening.
            if (!listener) break;

            // Tell each listener to stop, without infinitely calling `#off`.
            internalStopListening(listener, this, name, callback);
        }
        if (_.isEmpty(listeners)) this._listeners = void 0;
    }
    return this;
};

// Tell this object to stop listening to either specific events ... or
// to every object it's currently listening to.
Events.stopListening =  function(obj, name, callback) {
    // Use an internal stopListening, telling it to call off on `obj`.
    if (this._listeningTo) internalStopListening(this, obj, name, callback, true);
    return this;
};

// The reducing API that removes a callback from the `events` object.
var offApi = function(events, name, callback, context) {
    // Remove all callbacks for all events.
    if (!events || !name && !context && !callback) return;

    var names = name ? [name] : _.keys(events);
    for (var i = 0; i < names.length; i++) {
        name = names[i];
        var handlers = events[name];

        // Bail out if there are no events stored.
        if (!handlers) break;

        // Find any remaining events.
        var remaining = [];
        if (callback || context) {
            for (var j = 0, k = handlers.length; j < k; j++) {
                var handler = handlers[j];
                if (
                    callback && callback !== handler.callback &&
                    callback !== handler.callback._callback ||
                    context && context !== handler.context
                ) {
                    remaining.push(handler);
                }
            }
        }

        // Replace events if there are any remaining.  Otherwise, clean up.
        if (remaining.length) {
            events[name] = remaining;
        } else {
            delete events[name];
        }
    }
    if (!_.isEmpty(events)) return events;
};

var internalStopListening = function(listener, obj, name, callback, offEvents) {
    var listeningTo = listener._listeningTo;
    var ids = obj ? [obj._listenId] : _.keys(listeningTo);
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var listening = listeningTo[id];

        // If listening doesn't exist, this object is not currently
        // listening to obj. Break out early.
        if (!listening) break;
        obj = listening.obj;
        if (offEvents) obj._events = eventsApi(offApi, obj._events, name, callback, listener);

        // Events will only ever be falsey if all the event callbacks
        // are removed. If so, stop delete the listening.
        var events = eventsApi(offApi, listening.events, name, callback);
        if (!events) {
            delete listeningTo[id];
            delete listening.obj._listeners[listener._listenId];
        }
    }
    if (_.isEmpty(listeningTo)) listener._listeningTo = void 0;
};

// Bind an event to only be triggered a single time. After the first time
// the callback is invoked, it will be removed.
Events.once =  function(name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = onceMap(name, callback, _.bind(this.off, this));
    return this.on(events, void 0, context);
};

// Inversion-of-control versions of `once`.
Events.listenToOnce =  function(obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = onceMap(name, callback, _.bind(this.stopListening, this, obj));
    return this.listenTo(obj, events);
};

// Reduces the event callbacks into a map of `{event: onceWrapper}`.
// `offer` unbinds the `onceWrapper` after it as been called.
var onceMap = function(name, callback, offer) {
    return eventsApi(function(map, name, callback, offer) {
        if (callback) {
            var once = map[name] = _.once(function() {
                offer(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
        }
        return map;
    }, {}, name, callback, offer);
};

// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
Events.trigger =  function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this, name, void 0, args);
    return this;
};

// Handles triggering the appropriate event callbacks.
var triggerApi = function(obj, name, cb, args) {
    if (obj._events) {
        var events = obj._events[name];
        var allEvents = obj._events.all;
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return obj;
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
};

// Proxy Underscore methods to a Backbone class' prototype using a
// particular attribute as the data argument
var addMethod = function(length, method, attribute) {
    switch (length) {
        case 1: return function() {
            return _[method](this[attribute]);
        };
        case 2: return function(value) {
            return _[method](this[attribute], value);
        };
        case 3: return function(iteratee, context) {
            return _[method](this[attribute], iteratee, context);
        };
        case 4: return function(iteratee, defaultVal, context) {
            return _[method](this[attribute], iteratee, defaultVal, context);
        };
        default: return function() {
            var args = slice.call(arguments);
            args.unshift(this[attribute]);
            return _[method].apply(_, args);
        };
    }
};
var addUnderscoreMethods = function(Class, methods, attribute) {
    _.each(methods, function(length, method) {
        if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
    });
};

// Aliases for backwards compatibility.
Events.bind   = Events.on;
Events.unbind = Events.off;

module.exports = Events;


},{}],5:[function(require,module,exports){
var _ = require('underscore');
var Events = require('./backboneEvents');

var AppDispatcher = _.extend({}, Events);

module.exports = AppDispatcher;


},{"./backboneEvents":4,"underscore":"underscore"}],"config":[function(require,module,exports){
module.exports = {
    maps: {
        center: [55.76, 37.64], // Москва
        zoom: 15,
        minZoom: 8,
        controls: ['zoomControl'],
        behaviors: ['drag']
    },

    // Подсказка
    hint: {
        price: -250, // point
        lifeTime: 5000, // ms
        countDown: 3000 // ms
    },

    // Очки за верный ответ
    point: 100,

    // Время игры
    timer: 3 * 60 * 1000
};


},{}]},{},[3]);
