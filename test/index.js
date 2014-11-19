// Require modules
var Hapi = require('hapi');
var Lab = require('lab');
var Code = require('code');
var Lantern = require('../');
var Path = require('path');


// Declare internals
var internals = {
    basePath: Path.join(__dirname, 'decks')
};


// Test shortcuts
var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;


describe('Uses hapi-lantern plugin', function () {

    it('Loads plugin without error', function (done) {

        var server = new Hapi.Server(0);

        server.pack.register({
            plugin: Lantern,
            options: {
                basePath: internals.basePath
            }
        }, function (err) {

            expect(err).to.not.exist();
            server.stop();
            done();
        });
    });

    it('Adds route for Reveal assets', function (done) {

        var server = new Hapi.Server(0);

        server.pack.register({
            plugin: Lantern,
            options: {
                basePath: internals.basePath
            }
        }, function (err) {

            server.start(function () {

                server.inject({ method: 'GET', url: '/hapi-lantern/Reveal/js/reveal.min.js' }, function (res) {

                    expect(res.statusCode).to.not.equal(404);
                    server.inject({ method: 'GET', url: '/hapi-lantern/Reveal/css/reveal.min.css' }, function (res) {

                        expect(res.statusCode).to.not.equal(404);
                        server.stop();
                        done();
                    });
                });
            });
        });
    });

    it('Adds route for Bespoke assets', function (done) {

        var server = new Hapi.Server(0);

        server.pack.register({
            plugin: Lantern,
            options: {
                basePath: internals.basePath
            }
        }, function (err) {

            server.start(function () {

                server.inject({ method: 'GET', url: '/hapi-lantern/Bespoke/js/bespoke.min.js' }, function (res) {

                    expect(res.statusCode).to.not.equal(404);
                    server.stop();
                    done();
                });
            });
        });
    });

    it('Adds route for Impress assets', function (done) {

        var server = new Hapi.Server(0);

        server.pack.register({
            plugin: Lantern,
            options: {
                basePath: internals.basePath
            }
        }, function (err) {

            server.start(function () {

                server.inject({ method: 'GET', url: '/hapi-lantern/Impress/js/impress.js' }, function (res) {

                    expect(res.statusCode).to.not.equal(404);
                    server.inject({ method: 'GET', url: '/hapi-lantern/Impress/css/impress-demo.css' }, function (res) {

                        expect(res.statusCode).to.not.equal(404);
                        server.stop();
                        done();
                    });
                });
            });
        });
    });

    it('Adds routes for a slide deck', function (done) {

        var server = new Hapi.Server(0);

        server.pack.register({
            plugin: Lantern,
            options: {
                basePath: internals.basePath,
                decks: [
                    {
                        title: 'Reveal Test',
                        description: 'A test Reveal presentation',
                        filename: 'reveal',
                        paths: {
                            folder: Path.join(__dirname, 'decks'),
                            route: '/reveal'
                        },
                        type: 'Reveal',
                        theme: 'sky'
                    }
                ]
            }
        }, function (err) {

            server.start(function () {

                server.inject({ method: 'GET', url: '/reveal' }, function (res) {

                    expect(res.statusCode).to.not.equal(404);
                    server.stop();
                    done();
                });
            });
        });
    });

    it('Adds routes for custom assets', function (done) {

        var server = new Hapi.Server(0);

        server.pack.register({
            plugin: Lantern,
            options: {
                basePath: internals.basePath,
                assets: Path.join(__dirname, 'assets')
            }
        }, function (err) {

            server.start(function () {

                server.inject({ method: 'GET', url: '/hapi-lantern/assets/css/test.css' }, function (res) {

                    expect(res.statusCode).to.not.equal(404);

                    server.inject({ method: 'GET', url: '/hapi-lantern/assets/js/test.js' }, function (res) {

                        expect(res.statusCode).to.not.equal(404);

                        server.inject({ method: 'GET', url: '/hapi-lantern/assets/images/test.jpg' }, function (res) {

                            expect(res.statusCode).to.not.equal(404);
                            server.stop();
                            done();
                        });
                    });
                });
            });
        });
    });
});
