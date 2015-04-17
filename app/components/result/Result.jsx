/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('result');

/**
 * Счетчик отчков
 *
 * @type {*|Function}
 */
var Result = React.createClass({
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
            <div className={b()}>
                Ваш результат: {this.props.points}
            </div>
        );
    }
});

module.exports = Result;
