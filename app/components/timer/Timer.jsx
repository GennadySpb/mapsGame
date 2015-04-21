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
var Counter = React.createClass({
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
            <div className={b({disabled: this.props.disabled})}>
                {this._getUserTime()}
            </div>
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
