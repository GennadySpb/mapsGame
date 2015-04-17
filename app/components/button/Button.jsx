/** @jsx React.DOM */

var React = require('react');
var b = require('b_');
var _ = require('underscore');

var Button = React.createClass({
    propTypes: {
        content: React.PropTypes.string,
        href: React.PropTypes.string,
        onClick: React.PropTypes.func,
        disabled: React.PropTypes.bool
    },

    render: function () {
        var mods = _.omit(this.props, ['onClick', 'href', 'content']);

        if (this.props.href) {
            return this.renderAnchor(mods);
        } else {
            return this.renderButton(mods);
        }
    },

    renderAnchor: function (mods) {
        var props = {
            href: this.props.href,
            className: b('button', mods),
            role: 'button',
            onClick: this.handleClick
        };

        return <a {...props}>{this.props.content}</a>;
    },

    renderButton: function (mods) {
        var props = {
            className: b('button', mods),
            type: 'button',
            onClick: this.handleClick
        };

        return <button {...props}>{this.props.content}</button>;
    },

    handleClick: function (e) {
        if (this.props.disabled) {
            e.preventDefault();
            return;
        }

        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }
});

module.exports = Button;
