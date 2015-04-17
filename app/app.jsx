/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');

require('./controller/map');

var b_ = require('b_').with('app');

var AppActions = require('./actions/AppActions');

var LauncherView = require('./components/launcher/Launcher');
var CounterView = require('./components/counter/Counter');
var HintView = require('./components/hint/Hint');
var ListView = require('./components/list/List');
var ResultView = require('./components/result/Result');

var dispatcher = require('./utils/dispatcher');

var App = React.createClass({
    getInitialState: function () {
        return {
            play: false,
            gameOver: false,
            points: 0
        };
    },

    render: function () {
        return (
            <div className={b_('wrapper')}>
                {this._renderGame()}
                {this._renderLauncher()}
                {this._renderEnd()}
            </div>
        );
    },

    /**
     * Отрисовываем интерфейс
     * @returns {*}
     * @private
     */
    _renderGame: function () {
        if (!this.state.play) {
            return null;
        }

        return [
            <CounterView disabled={this.state.gameOver} />,
            <ListView disabled={this.state.gameOver} />,
            <HintView disabled={this.state.gameOver} />
        ]
    },

    /**
     * Отрисовываем стартовой окно
     *
     * @returns {*}
     * @private
     */
    _renderLauncher: function () {
        if (this.state.play) {
            return null;
        }

        return (
            <LauncherView handleClick={this._handlePlay} />
        )
    },

    _renderEnd: function () {
        if (this.state.gameOver) {
            return (<ResultView points={this.state.points}/>);
        }

        return null;
    },

    /**
     * Играем!
     *
     * @private
     */
    _handlePlay: function () {
        if (!this.state.play) {
            AppActions.play();
        }

        this.setState({play: true});
    },

    componentDidMount: function () {
        this._bindToEvents();
    },

    _bindToEvents: function () {
        dispatcher.on('showResult', function (data) {
            this.setState({gameOver: true, points: data.points});
        }, this);
    }
});

React.render(<App/>, document.querySelector('#application'));
