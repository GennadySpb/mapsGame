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
