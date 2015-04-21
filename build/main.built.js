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


},{"../utils/dispatcher":14}],2:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');

require('./controller/map');

var b_ = require('b_').with('app');

var AppActions = require('./actions/AppActions');

var LauncherView = require('./components/launcher/Launcher');
var CounterView = require('./components/counter/Counter');
var HintView = require('./components/hint/Hint');
var ListView = require('./components/list/List');
var TimerView = require('./components/timer/Timer');
var ResultView = require('./components/result/Result');

var dispatcher = require('./utils/dispatcher');

var App = React.createClass({displayName: "App",
    getInitialState: function () {
        return {
            play: false,
            gameOver: false,
            points: 0
        };
    },

    render: function () {
        return (
            React.createElement("div", {className: b_('wrapper')}, 
                this._renderGame(), 
                this._renderLauncher(), 
                this._renderEnd()
            )
        );
    },

    /**
     * Отрисовываем интерфейс
     * @returns {*}
     * @private
     */
    _renderGame: function () {
        if (!this.state.play) {
            return null;
        }

        return [
            React.createElement(CounterView, {disabled: this.state.gameOver}),
            React.createElement(ListView, {disabled: this.state.gameOver}),
            React.createElement(HintView, {disabled: this.state.gameOver}),
            React.createElement(TimerView, {disabled: this.state.gameOver})
        ]
    },

    /**
     * Отрисовываем стартовой окно
     *
     * @returns {*}
     * @private
     */
    _renderLauncher: function () {
        if (this.state.play) {
            return null;
        }

        return (
            React.createElement(LauncherView, {handleClick: this._handlePlay})
        )
    },

    _renderEnd: function () {
        if (this.state.gameOver) {
            return (React.createElement(ResultView, {points: this.state.points}));
        }

        return null;
    },

    /**
     * Играем!
     *
     * @private
     */
    _handlePlay: function () {
        if (!this.state.play) {
            AppActions.play();
        }

        this.setState({play: true});
    },

    componentDidMount: function () {
        this._bindToEvents();
    },

    _bindToEvents: function () {
        dispatcher.on('showResult', function (data) {
            this.setState({gameOver: true, points: data.points});
        }, this);
    }
});

React.render(React.createElement(App, null), document.querySelector('#application'));


},{"./actions/AppActions":1,"./components/counter/Counter":4,"./components/hint/Hint":5,"./components/launcher/Launcher":6,"./components/list/List":7,"./components/result/Result":8,"./components/timer/Timer":9,"./controller/map":10,"./utils/dispatcher":14,"b_":"b_","react":"react","underscore":"underscore"}],3:[function(require,module,exports){
/** @jsx React.DOM */

var React = require('react');
var b = require('b_');
var _ = require('underscore');

var Button = React.createClass({displayName: "Button",
    propTypes: {
        content: React.PropTypes.string,
        href: React.PropTypes.string,
        onClick: React.PropTypes.func,
        disabled: React.PropTypes.bool
    },

    render: function () {
        var mods = _.omit(this.props, ['onClick', 'href', 'content']);

        if (this.props.href) {
            return this.renderAnchor(mods);
        } else {
            return this.renderButton(mods);
        }
    },

    renderAnchor: function (mods) {
        var props = {
            href: this.props.href,
            className: b('button', mods),
            role: 'button',
            onClick: this.handleClick
        };

        return React.createElement("a", React.__spread({},  props), this.props.content);
    },

    renderButton: function (mods) {
        var props = {
            className: b('button', mods),
            type: 'button',
            onClick: this.handleClick
        };

        return React.createElement("button", React.__spread({},  props), this.props.content);
    },

    handleClick: function (e) {
        if (this.props.disabled) {
            e.preventDefault();
            return;
        }

        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }
});

module.exports = Button;


},{"b_":"b_","react":"react","underscore":"underscore"}],4:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('counter');

var dispatcher = require('../../utils/dispatcher');

/**
 * Счетчик отчков
 *
 * @type {*|Function}
 */
var Counter = React.createClass({displayName: "Counter",
    getDefaultProps: function () {
        return {
            disabled: false
        };
    },

    propTypes: {
        disabled: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            count: 0
        };
    },

    componentDidMount: function () {
        dispatcher.on('updatePoints', this._updateCount, this);
    },

    /**
     * Обновляем очки
     * @param {Number} count
     * @private
     */
    _updateCount: function (count) {
        this.setState({
            count: count
        });
    },

    /**
     *
     */
    componentWillUpdate: function (nextProps, nextState) {
        if (this.state.count !== nextState.count) {
            this._toggle = !this._toggle;
        }
    },

    render: function () {
        return (
            React.createElement("div", {className: b({disabled: this.props.disabled})}, 
                React.createElement("div", {className: b('wrapper')}, 
                    React.createElement("div", {className: b('count', {toggle: this._toggle})}, this.state.count)
                )
            )
        );
    }
});

module.exports = Counter;


},{"../../utils/dispatcher":14,"b_":"b_","react":"react"}],5:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('hint');

var config = require('config');

var AppActions = require('../..//actions/AppActions');

/**
 * Кнопка подсказки
 * @type {*|Function}
 */
var Hint = React.createClass({displayName: "Hint",
    getDefaultProps: function () {
        return {
            disabled: false
        };
    },

    propTypes: {
        disabled: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            actived: false
        };
    },

    componentDidMount: function () {
    },

    render: function () {
        return (
            React.createElement("div", {className: b({actived: this.state.actived, disabled: this.props.disabled}), onClick: this.getHint}, 
                React.createElement("div", {className: b('wrapper')}, 
                    "?"
                )
            )
        );
    },

    getHint: function () {
        var self  = this;
        if (this.state.actived || this.props.disabled) {
            return;
        }

        this.replaceState({actived: true});
        AppActions.useHint(config.hint.price);

        setTimeout(function () {
            self.replaceState({actived: false});
        }, config.hint.countDown);
    }
});

module.exports = Hint;


},{"../..//actions/AppActions":1,"b_":"b_","config":"config","react":"react"}],6:[function(require,module,exports){
//
var React = require('react');
var _ = require('underscore');

var config = require('config');

var b = require('b_').with('launcher');
var Button = require('../button/Button.jsx');

/**
 * Экран старта
 *
 * @type {*|Function}
 */
var Launcher = React.createClass({displayName: "Launcher",
    getInitialState: function () {
        return {
            rules: false
        };
    },

    componentDidMount: function () {

    },

    render: function () {
        return (
            React.createElement("div", {className: b({rules: this.state.rules})}, 
                React.createElement("div", {className: b('main')}, 
                    React.createElement("h1", {className: b('title')}, "А ты знаешь свой город?"), 
                    React.createElement("p", {className: b('info')}, "Эта игра проверит твое знание Москвы. Не забудь заглянуть в правила перед началом игры."), 
                    React.createElement("div", {className: b('footer')}, 
                        React.createElement(Button, {theme: "play", content: "Играем!", onClick: this.props.handleClick}), 
                        React.createElement(Button, {theme: "pseudo", content: "Правила", onClick: this.handleRules})
                    )
                ), 
                React.createElement("div", {className: b('back')}, 
                    React.createElement("h2", {className: b('title')}, "Правила игры"), 
                    React.createElement("p", {className: b('info')}, "Правила игры очень просты. Тебе необходимо за 3 минуты, найти как можно больше объектов на карте и кликнуть по ним."), 
                    React.createElement("ul", null, 
                        React.createElement("li", null, "За каждый объект ты будешь получать 100 очков."), 
                        React.createElement("li", null, "Ты можешь воспользоваться подсказкой, в левом нижнем углу, но она обойдется тебе в 250 очков.")
                    ), 
                    React.createElement("p", null, "Объект который нужно найти - находится первым в списке (правый нижний угл)."), 
                    React.createElement("div", {className: b('footer')}, 
                        React.createElement(Button, {theme: "pseudo", arrow: "left", content: "Назад", onClick: this.handleBack})
                    )
                )
            )
        );
    },

    /**
     *
     */
    handleRules: function () {
        this.setState({rules: true});
    },

    /**
     *
     */
    handleBack: function () {
        this.setState({rules: false});
    }
});

module.exports = Launcher;


},{"../button/Button.jsx":3,"b_":"b_","config":"config","react":"react","underscore":"underscore"}],7:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('list');

var dispatcher = require('../../utils/dispatcher');

/**
 * Список объектов которые нужно найти
 * @type {*|Function}
 */
var List = React.createClass({displayName: "List",
    getDefaultProps: function () {
        return {
            disabled: false
        };
    },

    propTypes: {
        disabled: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            geoObjects: []
        };
    },

    componentDidMount: function () {
        dispatcher.on('updateGeobjects', this._updateGeoObject);
    },

    _updateGeoObject: function (data) {
        this.replaceState({
            geoObjects: data
        });
    },

    render: function () {
        return (
            React.createElement("div", {className: b({hide: !this.state.geoObjects.length || this.props.disabled})}, 
                React.createElement("div", {className: b('wrapper')}, 
                    React.createElement("ul", {className: b('items')}, 
                        this.state.geoObjects.map(function (geo, index) {
                            return this._renderItem(geo, index);
                        }, this)
                    )
                )
            )
        );
    },

    _renderItem: function (geo, index) {
        return (
            React.createElement("li", {className: b('item'), key: index}, geo.title)
        );
    }
});

module.exports = List;


},{"../../utils/dispatcher":14,"b_":"b_","react":"react"}],8:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('result');

/**
 * Счетчик отчков
 *
 * @type {*|Function}
 */
var Result = React.createClass({displayName: "Result",
    getDefaultProps: function () {
        return {
            points: 0
        };
    },

    propTypes: {
        points: React.PropTypes.number
    },

    render: function () {
        return (
            React.createElement("div", {className: b()}, 
                "Ваш результат: ", this.props.points
            )
        );
    }
});

module.exports = Result;


},{"b_":"b_","react":"react"}],9:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('timer');

var config = require('config');

var AppActions = require('../../actions/AppActions');

/**
 * Счетчик отчков
 *
 * @type {*|Function}
 */
var Counter = React.createClass({displayName: "Counter",
    getDefaultProps: function () {
        return {
            disabled: false
        };
    },

    propTypes: {
        disabled: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            timer: +new Date()
        };
    },

    componentDidMount: function () {
        var self = this;

        this._startTime = +new Date();

        this._timer = setInterval(function () {
            self._updateTime();
        }, 1000);
    },

    _updateTime: function () {
        this.replaceState({
            timer: +new Date()
        });

        var diffTime = this.state.timer - this._startTime;

        if (diffTime >= config.timer) {
            clearInterval(this._timer);
            AppActions.timeout();
        }
    },

    render: function () {
        return (
            React.createElement("div", {className: b({disabled: this.props.disabled})}, 
                this._getUserTime()
            )
        );
    },

    /**
     * Запрос оставшегося времени игры
     * @returns {number}
     * @private
     */
    _getUserTime: function () {
        var result = Math.floor((config.timer - (this.state.timer - (this._startTime || +new Date()))) / 1000);

        if (result < 0) {
            result = 'end'
        }

        return result;
    }
});

module.exports = Counter;


},{"../../actions/AppActions":1,"b_":"b_","config":"config","react":"react"}],10:[function(require,module,exports){
/* global ymaps */

var _ = require('underscore');
var config = require('config');

require('../store/app');

var geoObjects = require('../data/geoObjects');

var AppActions = require('../actions/AppActions');
var dispatcher = require('../utils/dispatcher');

function MyMap (ymaps) {
    this._ymaps = ymaps;
    this._map = null;

    ymaps.ready(this._init.bind(this));

    this._bindToEvents();
}

_.extend(MyMap.prototype, {
    _init: function () {
        this._map = new ymaps.Map('map', _.extend({}, config.maps));
        this._gameObjects = geoObjects;

        delete window.ymaps;
    },

    /**
     *
     * @returns {*}
     */
    getYmaps: function () {
        return this._ymaps;
    },

    /**
     *
     * @returns {null|*}
     */
    getMap: function () {
        return this._map;
    },

    /**
     * Стартуем элементы на карте
     *
     * @private
     */
    _initMapsLayer: function () {
        var self = this;

        this._geoGameObjects = this._gameObjects.map(function (geoObject, index) {
            // Создаем круг.
            var myCircle = new self._ymaps.Circle([
                // Координаты центра круга.
                geoObject.point,
                // Радиус круга в метрах.
                100 * geoObject.areaFactor
            ], {hintContent: geoObject.title}, {
                fillColor: "#ffffff22",
                // Ширина обводки в пикселях.
                strokeWidth: 0
            });

            // Добавляем круг на карту.
            self.getMap().geoObjects.add(myCircle);

            return myCircle;
        });

        this._activeGameObject();
    },

    /**
     * Активируем следующий элемент
     * @private
     */
    _activeGameObject: function () {
        var self = this;

        var current = this._geoGameObjects.shift();

        if (!current) {
            this._gameOver();

            return;
        }

        current.events.once([
            'click'
        ], function (e) {
            current.events.remove(['click']);
            self._handleClick();
        });

        setTimeout(function () {
            AppActions.updateGeoObject(self._gameObjects);
        }, 100);
    },

    _gameOver: function () {
        AppActions.endGame();
    },

    /**
     * Клиенули по объекту
     * @private
     */
    _handleClick: function () {
        AppActions.answer(config.point);

        this._gameObjects.shift();
        this._activeGameObject();
    },

    /**
     * Вешаем обработчики
     * @private
     */
    _bindToEvents: function () {
        dispatcher.on('play', function () {
            this._initMapsLayer();
        }, this);

        dispatcher.on('hint', function () {
            this._showHint();
        }, this);
    },

    _getCurrentObject: function () {
        return this._gameObjects[0];
    },

    /**
     * Показываем подсказку
     * @private
     */
    _showHint: function () {
        var currentObject = this._getCurrentObject(),
            center = this.getMap().getCenter();

        // Создаем ломаную, используя класс GeoObject.
        var hintObject = new this._ymaps.GeoObject({
            // Описываем геометрию геообъекта.
            geometry: {
                // Тип геометрии - "Ломаная линия".
                type: "LineString",
                // Указываем координаты вершин ломаной.
                coordinates: [
                    center,
                    currentObject.point
                ]
            }
        }, {
            strokeColor: "#0077ff",
            // Ширина линии.
            strokeWidth: 2,
            strokeOpacity: 0.6
        });

        this.getMap().geoObjects
            .add(hintObject);

        this._removeHintOnTimeout(hintObject);
    },

    /**
     * Удалаяем подсказку спустя время
     * @param hintObject
     * @private
     */
    _removeHintOnTimeout: function (hintObject) {
        var self = this;

        setTimeout(function () {
            self.getMap().geoObjects
                .remove(hintObject);
        }, config.hint.lifeTime);
    }
});

module.exports = new MyMap(ymaps);


},{"../actions/AppActions":1,"../data/geoObjects":11,"../store/app":12,"../utils/dispatcher":14,"config":"config","underscore":"underscore"}],11:[function(require,module,exports){
module.exports = [
    {
        title: 'Кремлевский дворец',
        point: [55.75233, 37.617692],
        areaFactor: 2.4
    },
    {
        title: 'МГУ',
        point: [55.702987, 37.53093],
        areaFactor: 2.4
    },
    {
        title: 'Храм Христа Спасителя',
        point: [55.744566, 37.605499],
        areaFactor: 1
    },
    {
        title: 'Манежная площадь',
        point: [55.755778, 37.614868],
        areaFactor: 1.2
    },
    {
        title: 'Московский зоопарк',
        point: [55.761117, 37.578352],
        areaFactor: 2.2
    },
    {
        title: 'Третьяковская галерея',
        point: [55.741667, 37.620779],
        areaFactor: 1
    },
    {
        title: 'Казанский вокзал',
        point: [55.773089, 37.656532],
        areaFactor: 2
    },
    {
        title: 'Театральная площадь',
        point: [55.758772, 37.619414],
        areaFactor: 1.4
    },
    {
        title: 'памятник Петру I',
        point: [55.791309, 37.763081],
        areaFactor: 2
    },
    {
        title: 'Останкинская телебашня',
        point: [55.821431, 37.614482],
        areaFactor: 1
    },
    {
        title: 'Большой театр',
        point: [55.760109, 37.618578],
        areaFactor: 0.5
    },
    {
        title: 'Институт музыки',
        point: [55.794102, 37.486167],
        areaFactor: 1
    },
    {
        title: 'Аэропорт Внуково',
        point: [55.60623, 37.28861],
        areaFactor: 2
    },
    {
        title: 'озеро Мазуринское',
        point: [55.811912, 37.912381],
        areaFactor: 3
    }
];


},{}],12:[function(require,module,exports){
var dispatcher = require('../utils/dispatcher');
var AppActions = require('../actions/AppActions');

// Маленькая моделька - очки пользователя
var store = {
    points: 0,

    init: function () {
        dispatcher.on('addPoints hint', function (point) {
            this.points += point;

            AppActions.updatePoints(this.points);
        }, this);

        dispatcher.on('endGame timeout', function () {
            // TODO: добавить статистику
            AppActions.showResult({
                points: this.points
            });
        }, this);
    }
};

store.init();

module.exports = store;


},{"../actions/AppActions":1,"../utils/dispatcher":14}],13:[function(require,module,exports){
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


},{}],14:[function(require,module,exports){
var _ = require('underscore');
var Events = require('./backboneEvents');

var AppDispatcher = _.extend({}, Events);

module.exports = AppDispatcher;


},{"./backboneEvents":13,"underscore":"underscore"}],"config":[function(require,module,exports){
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


},{}]},{},[2]);
