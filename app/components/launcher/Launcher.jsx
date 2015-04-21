//
var React = require('react');
var _ = require('underscore');

var config = require('config');

var b = require('b_').with('launcher');
var Button = require('../button/Button.jsx');

/**
 * Экран старта
 *
 * @type {*|Function}
 */
var Launcher = React.createClass({
    getInitialState: function () {
        return {
            rules: false
        };
    },

    componentDidMount: function () {

    },

    render: function () {
        return (
            <div className={b({rules: this.state.rules})}>
                <div className={b('main')}>
                    <h1 className={b('title')}>А ты знаешь свой город?</h1>
                    <p className={b('info')}>Эта игра проверит твое знание Москвы. Не забудь заглянуть в правила перед началом игры.</p>
                    <div className={b('footer')}>
                        <Button theme="play" content='Играем!' onClick={this.props.handleClick}/>
                        <Button theme="pseudo" content='Правила' onClick={this.handleRules}/>
                    </div>
                </div>
                <div className={b('back')}>
                    <h2 className={b('title')}>Правила игры</h2>
                    <p className={b('info')}>Правила игры очень просты. Тебе необходимо за 3 минуты, найти как можно больше объектов на карте и кликнуть по ним.</p>
                    <ul>
                        <li>За каждый объект ты будешь получать 100 очков.</li>
                        <li>Ты можешь воспользоваться подсказкой, в левом нижнем углу, но она обойдется тебе в 250 очков.</li>
                    </ul>
                    <p>Объект который нужно найти - находится первым в списке (правый нижний угл).</p>
                    <div className={b('footer')}>
                        <Button theme="pseudo" arrow="left" content='Назад' onClick={this.handleBack}/>
                    </div>
                </div>
            </div>
        );
    },

    /**
     *
     */
    handleRules: function () {
        this.setState({rules: true});
    },

    /**
     *
     */
    handleBack: function () {
        this.setState({rules: false});
    }
});

module.exports = Launcher;
