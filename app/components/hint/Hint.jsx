/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('hint');

var config = require('config');

var AppActions = require('../..//actions/AppActions');

/**
 * Кнопка подсказки
 * @type {*|Function}
 */
var Hint = React.createClass({
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
            <div className={b({actived: this.state.actived, disabled: this.props.disabled})} onClick={this.getHint}>
                <div className={b('wrapper')}>
                    ?
                </div>
            </div>
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
