/** @jsx React.DOM */
var React = require('react');
var b = require('b_').with('list');

var dispatcher = require('../../utils/dispatcher');

/**
 * Список объектов которые нужно найти
 * @type {*|Function}
 */
var List = React.createClass({
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
            geoObjects: []
        };
    },

    componentDidMount: function () {
        dispatcher.on('updateGeobjects', this._updateGeoObject);
    },

    _updateGeoObject: function (data) {
        this.replaceState({
            geoObjects: data
        });
    },

    render: function () {
        return (
            <div className={b({hide: !this.state.geoObjects.length || this.props.disabled})}>
                <div className={b('wrapper')}>
                    <ul className={b('items')}>
                        {this.state.geoObjects.map(function (geo, index) {
                            return this._renderItem(geo, index);
                        }, this)}
                    </ul>
                </div>
            </div>
        );
    },

    _renderItem: function (geo, index) {
        return (
            <li className={b('item')} key={index}>{geo.title}</li>
        );
    }
});

module.exports = List;
