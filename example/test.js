var Hapi = require('hapi');
var Lantern = require('../');
var Path = require('path');


var server = new Hapi.Server(10700);

server.pack.register({
    plugin: Lantern,
    options: {
        basePath: Path.join(__dirname, 'decks'),
        assets: Path.join(__dirname, 'assets'),
        decks: [
            {
                title: 'Hapi-Lantern',
                description: 'A Hapi plugin to bootstrap slide deck presentation',
                filename: 'lantern',
                paths: {
                    folder: Path.join(__dirname, 'decks'),
                    route: '/lantern'
                },
                type: 'Reveal',
                theme: 'sky'
            }
        ]
    }
}, function (err) {

    server.start(function () {

        console.log('Server started....');
    });
});
