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

    endGame: function () {
        dispatcher.trigger('endGame');
    },

    showResult: function (data) {
        dispatcher.trigger('showResult', data);
    },

    pointsUpdated: function (points) {
        dispatcher.trigger('pointsUpdated', points);
    }
};
