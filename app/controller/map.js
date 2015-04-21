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
