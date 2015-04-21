/* global describe, before, after, it */
var expect = require('chai').expect;
var appActions = require('../../actions/AppActions');
var dispatcher = require('../../utils/dispatcher');

describe('Actions', function () {
    describe('app', function () {
        it('updateGeoObject trigger updateGeobjects', function (done) {
            var data = { test: 1 };
            dispatcher.on('updateGeobjects', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.updateGeoObject(data);
        });

        it('play trigger play', function (done) {
            dispatcher.on('play', function (actual) {
                expect(actual).to.be.undefined;
                done();
            });

            appActions.play();
        });

        it('answer trigger addPoints', function (done) {
            var data = 1;

            dispatcher.on('addPoints', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.answer(data);
        });

        it('useHint trigger hint', function (done) {
            var data = 1;

            dispatcher.on('hint', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.useHint(data);
        });

        it('endGame trigger endGame', function (done) {
            dispatcher.on('endGame', function (actual) {
                expect(actual).to.be.undefined;
                done();
            });

            appActions.endGame();
        });

        it('showResult trigger showResult', function (done) {
            var data = { test: 1 };

            dispatcher.on('showResult', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.showResult(data);
        });

        it('updatePoints trigger updatePoints', function (done) {
            var data = 1;

            dispatcher.on('updatePoints', function (actual) {
                expect(actual).to.eql(data);
                done();
            });

            appActions.updatePoints(data);
        });

        it('timeout trigger timeout', function (done) {
            dispatcher.on('timeout', function (actual) {
                expect(actual).to.be.undefined;
                done();
            });

            appActions.timeout();
        });
    });
});

