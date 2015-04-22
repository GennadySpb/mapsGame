require=function t(e,n,i){function r(a,o){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!o&&c)return c(a,!0);if(s)return s(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return r(n?n:t)},u,u.exports,t,e,n,i)}return n[a].exports}for(var s="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(t,e){var n=t("../utils/dispatcher");e.exports={updateGeoObject:function(t){n.trigger("updateGeobjects",t)},play:function(){n.trigger("play")},answer:function(t){n.trigger("addPoints",t)},useHint:function(t){n.trigger("hint",t)},endGame:function(){n.trigger("endGame")},showResult:function(t){n.trigger("showResult",t)},updatePoints:function(t){n.trigger("updatePoints",t)},timeout:function(){n.trigger("timeout")}}},{"../utils/dispatcher":14}],2:[function(t){{var e=t("react");t("underscore")}t("./controller/map");var n=t("b_").with("app"),i=t("./actions/AppActions"),r=t("./components/launcher/Launcher"),s=t("./components/counter/Counter"),a=t("./components/hint/Hint"),o=t("./components/list/List"),c=t("./components/timer/Timer"),l=t("./components/result/Result"),u=t("./utils/dispatcher"),p=e.createClass({displayName:"App",getInitialState:function(){return{play:!1,gameOver:!1,points:0}},render:function(){return e.createElement("div",{className:n("wrapper")},this._renderGame(),this._renderLauncher(),this._renderEnd())},_renderGame:function(){return this.state.play?[e.createElement(s,{disabled:this.state.gameOver}),e.createElement(o,{disabled:this.state.gameOver}),e.createElement(a,{disabled:this.state.gameOver}),e.createElement(c,{disabled:this.state.gameOver})]:null},_renderLauncher:function(){return this.state.play?null:e.createElement(r,{handleClick:this._handlePlay})},_renderEnd:function(){return this.state.gameOver?e.createElement(l,{points:this.state.points}):null},_handlePlay:function(){this.state.play||i.play(),this.setState({play:!0})},componentDidMount:function(){this._bindToEvents()},_bindToEvents:function(){u.on("showResult",function(t){this.setState({gameOver:!0,points:t.points})},this)}});e.render(e.createElement(p,null),document.querySelector("#application"))},{"./actions/AppActions":1,"./components/counter/Counter":4,"./components/hint/Hint":5,"./components/launcher/Launcher":6,"./components/list/List":7,"./components/result/Result":8,"./components/timer/Timer":9,"./controller/map":10,"./utils/dispatcher":14,b_:"b_",react:"react",underscore:"underscore"}],3:[function(t,e){var n=t("react"),i=t("b_"),r=t("underscore"),s=n.createClass({displayName:"Button",propTypes:{content:n.PropTypes.string,href:n.PropTypes.string,onClick:n.PropTypes.func,disabled:n.PropTypes.bool},render:function(){var t=r.omit(this.props,["onClick","href","content"]);return this.props.href?this.renderAnchor(t):this.renderButton(t)},renderAnchor:function(t){var e={href:this.props.href,className:i("button",t),role:"button",onClick:this.handleClick};return n.createElement("a",n.__spread({},e),this.props.content)},renderButton:function(t){var e={className:i("button",t),type:"button",onClick:this.handleClick};return n.createElement("button",n.__spread({},e),this.props.content)},handleClick:function(t){return this.props.disabled?void t.preventDefault():void(this.props.onClick&&this.props.onClick(t))}});e.exports=s},{b_:"b_",react:"react",underscore:"underscore"}],4:[function(t,e){var n=t("react"),i=t("b_").with("counter"),r=t("../../utils/dispatcher"),s=n.createClass({displayName:"Counter",getDefaultProps:function(){return{disabled:!1}},propTypes:{disabled:n.PropTypes.bool},getInitialState:function(){return{count:0}},componentDidMount:function(){r.on("updatePoints",this._updateCount,this)},_updateCount:function(t){this.setState({count:t})},componentWillUpdate:function(t,e){this.state.count!==e.count&&(this._toggle=!this._toggle)},render:function(){return n.createElement("div",{className:i({disabled:this.props.disabled})},n.createElement("div",{className:i("wrapper")},n.createElement("div",{className:i("count",{toggle:this._toggle})},this.state.count)))}});e.exports=s},{"../../utils/dispatcher":14,b_:"b_",react:"react"}],5:[function(t,e){var n=t("react"),i=t("b_").with("hint"),r=t("config"),s=t("../..//actions/AppActions"),a=n.createClass({displayName:"Hint",getDefaultProps:function(){return{disabled:!1}},propTypes:{disabled:n.PropTypes.bool},getInitialState:function(){return{actived:!1}},componentDidMount:function(){},render:function(){return n.createElement("div",{className:i({actived:this.state.actived,disabled:this.props.disabled}),onClick:this.getHint},n.createElement("div",{className:i("wrapper")},"?"))},getHint:function(){var t=this;this.state.actived||this.props.disabled||(this.replaceState({actived:!0}),s.useHint(r.hint.price),setTimeout(function(){t.replaceState({actived:!1})},r.hint.countDown))}});e.exports=a},{"../..//actions/AppActions":1,b_:"b_",config:"config",react:"react"}],6:[function(t,e){var n=t("react"),i=(t("underscore"),t("config"),t("b_").with("launcher")),r=t("../button/Button.jsx"),s=n.createClass({displayName:"Launcher",getInitialState:function(){return{rules:!1}},componentDidMount:function(){},render:function(){return n.createElement("div",{className:i({rules:this.state.rules})},n.createElement("div",{className:i("main")},n.createElement("h1",{className:i("title")},"А ты знаешь свой город?"),n.createElement("p",{className:i("info")},"Эта игра проверит твое знание Москвы. Не забудь заглянуть в правила перед началом игры."),n.createElement("div",{className:i("footer")},n.createElement(r,{theme:"play",content:"Играем!",onClick:this.props.handleClick}),n.createElement(r,{theme:"pseudo",content:"Правила",onClick:this.handleRules}))),n.createElement("div",{className:i("back")},n.createElement("h2",{className:i("title")},"Правила игры"),n.createElement("p",{className:i("info")},"Правила игры очень просты. Тебе необходимо за 3 минуты, найти как можно больше объектов на карте и кликнуть по ним."),n.createElement("ul",null,n.createElement("li",null,"За каждый объект ты будешь получать 100 очков."),n.createElement("li",null,"Ты можешь воспользоваться подсказкой, в левом нижнем углу, но она обойдется тебе в 250 очков.")),n.createElement("p",null,"Объект который нужно найти - находится первым в списке (правый нижний угл)."),n.createElement("div",{className:i("footer")},n.createElement(r,{theme:"pseudo",arrow:"left",content:"Назад",onClick:this.handleBack}))))},handleRules:function(){this.setState({rules:!0})},handleBack:function(){this.setState({rules:!1})}});e.exports=s},{"../button/Button.jsx":3,b_:"b_",config:"config",react:"react",underscore:"underscore"}],7:[function(t,e){var n=t("react"),i=t("b_").with("list"),r=t("../../utils/dispatcher"),s=n.createClass({displayName:"List",getDefaultProps:function(){return{disabled:!1}},propTypes:{disabled:n.PropTypes.bool},getInitialState:function(){return{geoObjects:[]}},componentDidMount:function(){r.on("updateGeobjects",this._updateGeoObject)},_updateGeoObject:function(t){this.replaceState({geoObjects:t})},render:function(){return n.createElement("div",{className:i({hide:!this.state.geoObjects.length||this.props.disabled})},n.createElement("div",{className:i("wrapper")},n.createElement("ul",{className:i("items")},this.state.geoObjects.map(function(t,e){return this._renderItem(t,e)},this))))},_renderItem:function(t,e){return n.createElement("li",{className:i("item"),key:e},t.title)}});e.exports=s},{"../../utils/dispatcher":14,b_:"b_",react:"react"}],8:[function(t,e){var n=t("react"),i=t("b_").with("result"),r=n.createClass({displayName:"Result",getDefaultProps:function(){return{points:0}},propTypes:{points:n.PropTypes.number},render:function(){return n.createElement("div",{className:i()},"Ваш результат: ",this.props.points)}});e.exports=r},{b_:"b_",react:"react"}],9:[function(t,e){var n=t("react"),i=t("b_").with("timer"),r=t("config"),s=t("../../actions/AppActions"),a=n.createClass({displayName:"Counter",getDefaultProps:function(){return{disabled:!1}},propTypes:{disabled:n.PropTypes.bool},getInitialState:function(){return{timer:+new Date}},componentDidMount:function(){var t=this;this._startTime=+new Date,this._timer=setInterval(function(){t._updateTime()},1e3)},_updateTime:function(){this.replaceState({timer:+new Date});var t=this.state.timer-this._startTime;t>=r.timer&&(clearInterval(this._timer),s.timeout())},render:function(){return n.createElement("div",{className:i({disabled:this.props.disabled})},this._getUserTime())},_getUserTime:function(){var t=Math.floor((r.timer-(this.state.timer-(this._startTime||+new Date)))/1e3);return 0>t&&(t="end"),t}});e.exports=a},{"../../actions/AppActions":1,b_:"b_",config:"config",react:"react"}],10:[function(t,e){function n(t){this._ymaps=t,this._map=null,t.ready(this._init.bind(this)),this._bindToEvents()}var i=t("underscore"),r=t("config");t("../store/app");var s=t("../data/geoObjects"),a=t("../actions/AppActions"),o=t("../utils/dispatcher");i.extend(n.prototype,{_init:function(){this._map=new ymaps.Map("map",i.extend({},r.maps)),this._gameObjects=s,delete window.ymaps},getYmaps:function(){return this._ymaps},getMap:function(){return this._map},_initMapsLayer:function(){var t=this;this._geoGameObjects=this._gameObjects.map(function(e){var n=new t._ymaps.Circle([e.point,100*e.areaFactor],{hintContent:e.title},{fillColor:"#ffffff22",strokeWidth:0});return t.getMap().geoObjects.add(n),n}),this._activeGameObject()},_activeGameObject:function(){var t=this,e=this._geoGameObjects.shift();return e?(e.events.once(["click"],function(){e.events.remove(["click"]),t._handleClick()}),void setTimeout(function(){a.updateGeoObject(t._gameObjects)},100)):void this._gameOver()},_gameOver:function(){a.endGame()},_handleClick:function(){a.answer(r.point),this._gameObjects.shift(),this._activeGameObject()},_bindToEvents:function(){o.on("play",function(){this._initMapsLayer()},this),o.on("hint",function(){this._showHint()},this)},_getCurrentObject:function(){return this._gameObjects[0]},_showHint:function(){var t=this._getCurrentObject(),e=this.getMap().getCenter(),n=new this._ymaps.GeoObject({geometry:{type:"LineString",coordinates:[e,t.point]}},{strokeColor:"#0077ff",strokeWidth:2,strokeOpacity:.6});this.getMap().geoObjects.add(n),this._removeHintOnTimeout(n)},_removeHintOnTimeout:function(t){var e=this;setTimeout(function(){e.getMap().geoObjects.remove(t)},r.hint.lifeTime)}}),e.exports=new n(ymaps)},{"../actions/AppActions":1,"../data/geoObjects":11,"../store/app":12,"../utils/dispatcher":14,config:"config",underscore:"underscore"}],11:[function(t,e){e.exports=[{title:"Кремлевский дворец",point:[55.75233,37.617692],areaFactor:2.4},{title:"МГУ",point:[55.702987,37.53093],areaFactor:2.4},{title:"Храм Христа Спасителя",point:[55.744566,37.605499],areaFactor:1},{title:"Манежная площадь",point:[55.755778,37.614868],areaFactor:1.2},{title:"Московский зоопарк",point:[55.761117,37.578352],areaFactor:2.2},{title:"Третьяковская галерея",point:[55.741667,37.620779],areaFactor:1},{title:"Казанский вокзал",point:[55.773089,37.656532],areaFactor:2},{title:"Театральная площадь",point:[55.758772,37.619414],areaFactor:1.4},{title:"памятник Петру I (крым-кая наб.)",point:[55.738226,37.608877],areaFactor:1},{title:"Останкинская телебашня",point:[55.819727,37.611715],areaFactor:1.2},{title:"Большой театр",point:[55.760109,37.618578],areaFactor:.5},{title:"Институт музыки",point:[55.794102,37.486167],areaFactor:1},{title:"Аэропорт Внуково",point:[55.60623,37.28861],areaFactor:2},{title:"озеро Мазуринское",point:[55.811912,37.912381],areaFactor:3}]},{}],12:[function(t,e){var n=t("../utils/dispatcher"),i=t("../actions/AppActions"),r={points:0,init:function(){n.on("addPoints hint",function(t){this.points+=t,i.updatePoints(this.points)},this),n.on("endGame timeout",function(){i.showResult({points:this.points})},this)}};r.init(),e.exports=r},{"../actions/AppActions":1,"../utils/dispatcher":14}],13:[function(t,e){var n={},i=/\s+/,r=function(t,e,n,r,s,a){var o,c=0;if(n&&"object"==typeof n)for(o=_.keys(n);c<o.length;c++)e=t(e,o[c],n[o[c]],s,a);else if(n&&i.test(n))for(o=n.split(i);c<o.length;c++)e=t(e,o[c],r,s,a);else e=t(e,n,r,s,a);return e};n.on=function(t,e,n){return this._events=r(s,this._events||{},t,e,n,this),this},n.listenTo=function(t,e,n){if(!t)return this;var i=t._listenId||(t._listenId=_.uniqueId("l")),a=this._listeningTo||(this._listeningTo={}),o=a[i];if(!o){o=a[i]={obj:t,events:{}},i=this._listenId||(this._listenId=_.uniqueId("l"));var c=t._listeners||(t._listeners={});c[i]=this}return t.on(e,n,this),o.events=r(s,o.events,e,n),this};var s=function(t,e,n,i,r){if(n){var s=t[e]||(t[e]=[]);s.push({callback:n,context:i,ctx:i||r})}return t};n.off=function(t,e,n){if(!this._events)return this;this._events=r(a,this._events,t,e,n);var i=this._listeners;if(i){for(var s=null!=n?[n._listenId]:_.keys(i),c=0;c<s.length;c++){var l=i[s[c]];if(!l)break;o(l,this,t,e)}_.isEmpty(i)&&(this._listeners=void 0)}return this},n.stopListening=function(t,e,n){return this._listeningTo&&o(this,t,e,n,!0),this};var a=function(t,e,n,i){if(t&&(e||i||n)){for(var r=e?[e]:_.keys(t),s=0;s<r.length;s++){e=r[s];var a=t[e];if(!a)break;var o=[];if(n||i)for(var c=0,l=a.length;l>c;c++){var u=a[c];(n&&n!==u.callback&&n!==u.callback._callback||i&&i!==u.context)&&o.push(u)}o.length?t[e]=o:delete t[e]}return _.isEmpty(t)?void 0:t}},o=function(t,e,n,i,s){for(var o=t._listeningTo,c=e?[e._listenId]:_.keys(o),l=0;l<c.length;l++){var u=c[l],p=o[u];if(!p)break;e=p.obj,s&&(e._events=r(a,e._events,n,i,t));var h=r(a,p.events,n,i);h||(delete o[u],delete p.obj._listeners[t._listenId])}_.isEmpty(o)&&(t._listeningTo=void 0)};n.once=function(t,e,n){var i=c(t,e,_.bind(this.off,this));return this.on(i,void 0,n)},n.listenToOnce=function(t,e,n){var i=c(e,n,_.bind(this.stopListening,this,t));return this.listenTo(t,i)};var c=function(t,e,n){return r(function(t,e,n,i){if(n){var r=t[e]=_.once(function(){i(e,r),n.apply(this,arguments)});r._callback=n}return t},{},t,e,n)};n.trigger=function(t){if(!this._events)return this;for(var e=Math.max(0,arguments.length-1),n=Array(e),i=0;e>i;i++)n[i]=arguments[i+1];return r(l,this,t,void 0,n),this};var l=function(t,e,n,i){if(t._events){var r=t._events[e],s=t._events.all;r&&u(r,i),s&&u(s,[e].concat(i))}return t},u=function(t,e){var n,i=-1,r=t.length,s=e[0],a=e[1],o=e[2];switch(e.length){case 0:for(;++i<r;)(n=t[i]).callback.call(n.ctx);return;case 1:for(;++i<r;)(n=t[i]).callback.call(n.ctx,s);return;case 2:for(;++i<r;)(n=t[i]).callback.call(n.ctx,s,a);return;case 3:for(;++i<r;)(n=t[i]).callback.call(n.ctx,s,a,o);return;default:for(;++i<r;)(n=t[i]).callback.apply(n.ctx,e);return}};n.bind=n.on,n.unbind=n.off,e.exports=n},{}],14:[function(t,e){var n=t("underscore"),i=t("./backboneEvents"),r=n.extend({},i);e.exports=r},{"./backboneEvents":13,underscore:"underscore"}],config:[function(t,e){e.exports={maps:{center:[55.76,37.64],zoom:15,minZoom:8,controls:["zoomControl"],behaviors:["drag"]},hint:{price:-250,lifeTime:5e3,countDown:3e3},point:100,timer:18e4}},{}]},{},[2]);