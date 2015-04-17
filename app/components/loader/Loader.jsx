/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');

var b = require('b_').with('loader');

var Spinner = require('../spinner/Spinner');

/**
 * Поиск
 * @type {*|Function}
 */
var Loader = React.createClass({
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

    componentDidMount: function () {
    },

    render: function () {
        return (
            <div className={b()}>
                <Spinner progress={this.props.progress} />
            </div>
        );
    }
});

module.exports = Loader;
