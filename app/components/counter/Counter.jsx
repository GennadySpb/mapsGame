/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('counter');

var dispatcher = require('../../utils/dispatcher');

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
            count: 0
        };
    },

    componentDidMount: function () {
        dispatcher.on('pointsUpdated', this._updateCount, this);
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
            <div className={b({disabled: this.props.disabled})}>
                <div className={b('wrapper')}>
                    <div className={b('count', {toggle: this._toggle})}>{this.state.count}</div>
                </div>
            </div>
        );
    }
});

module.exports = Counter;
