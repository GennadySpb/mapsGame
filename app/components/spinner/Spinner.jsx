/** @jsx React.DOM */

var React = require('react');
var b = require('b_');

/**
 * Загрузчик
 *
 * @type {*|Function}
 */
var Spinner = React.createClass({
    getDefaultProps: function () {
        return {
            progress: true,
            size: 'xl'
        };
    },

    propTypes: {
        progress: React.PropTypes.bool,
        size: React.PropTypes.string.isRequired
    },

    render: function () {
        return (
            <div className={b('spinner', {progress: this.props.progress, size: this.props.size})}></div>
        );
    }
});

module.exports = Spinner;
