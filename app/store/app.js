var dispatcher = require('../utils/dispatcher');
var AppActions = require('../actions/AppActions');

var store = {
    points: 0,

    init: function () {
        dispatcher.on('addPoints hint', function (point) {
            this.points += point;

            AppActions.pointsUpdated(this.points);
        }, this);

        dispatcher.on('endGame', function () {
            // TODO: добавить статистику
            AppActions.showResult({
                points: this.points
            });
        }, this);
    }
};

store.init();

module.exports = store;
