// Require modules
var Fs = require('fs');
var Path = require('path');
var Handlebars = require('handlebars');


// Set Internals
var internals = {
    basePath: Path.join(__dirname, '../'),
    views: {
        engines: {
            html: Handlebars
        },
        path: './',
        layoutPath: './layouts'
    }
};


module.exports = {
    register: function (plugin, options, next) {

        if (options.assets) {
            plugin.route([
                {
                    method: 'GET',
                    path: '/hapi-lantern/assets/css/{path*}',
                    handler: {
                        directory: {
                            listing: false,
                            index: false,
                            path: Path.join(options.assets, 'css')
                        }
                    }
                },
                {
                    method: 'GET',
                    path: '/hapi-lantern/assets/js/{path*}',
                    handler: {
                        directory: {
                            listing: false,
                            index: false,
                            path: Path.join(options.assets, 'js')
                        }
                    }
                },
                {
                    method: 'GET',
                    path: '/hapi-lantern/assets/images/{path*}',
                    handler: {
                        directory: {
                            listing: false,
                            index: false,
                            path: Path.join(options.assets, 'images')
                        }
                    }
                }
            ]);
        }

        //internals.basePath = options.basePath;
        //internals.viewsPath = options.viewsPath;

        var modulesPath = Path.join(internals.basePath, 'node_modules');
        var assetsPath = Path.join(internals.basePath, 'assets');

        var Reveal = {
            css: {
                handler: {
                    directory: {
                        listing: false,
                        index: false,
                        path: Path.join(modulesPath, 'reveal.js/css')
                    }
                }
            },
            lib: {
                handler: {
                    directory: {
                        listing: false,
                        index: false,
                        path: Path.join(modulesPath, 'reveal.js/lib')
                    }
                }
            },
            js: {
                handler: {
                    directory: {
                        listing: false,
                        index: false,
                        path: Path.join(modulesPath, 'reveal.js/js')
                    }
                }
            },
            plugin: {
                handler: {
                    directory: {
                        listing: false,
                        index: false,
                        path: Path.join(modulesPath, 'reveal.js/plugin')
                    }
                }
            }
        };

        var Bespoke = {
            js: { handler: { directory: { listing: false, index: false, path: Path.join(modulesPath, 'bespoke/dist') }}}
        };

        var Impress = {
            js: { handler: { directory: { listing: false, index: false, path: Path.join(assetsPath, 'impress.js/js') }}},
            css: { handler: { directory: { listing: false, index: false, path: Path.join(assetsPath, 'impress.js/css') }}}
        };

        plugin.route({ method: 'GET', path: '/hapi-lantern/Reveal/css/{path*}', config: Reveal.css });
        plugin.route({ method: 'GET', path: '/hapi-lantern/Reveal/js/{path*}', config: Reveal.js });
        plugin.route({ method: 'GET', path: '/hapi-lantern/Reveal/lib/{path*}', config: Reveal.lib });
        plugin.route({ method: 'GET', path: '/hapi-lantern/Reveal/plugin/{path*}', config: Reveal.plugin });

        plugin.route({ method: 'GET', path: '/hapi-lantern/Bespoke/js/{path*}', config: Bespoke.js });

        plugin.route({ method: 'GET', path: '/hapi-lantern/Impress/css/{path*}', config: Impress.css });
        plugin.route({ method: 'GET', path: '/hapi-lantern/Impress/js/{path*}', config: Impress.js });

        internals.views.basePath = options.basePath;
        plugin.views(internals.views);

        internals.copyLayouts(internals.views.basePath);

        var decks = options.decks || [];
        decks.map(internals.registerDeck(plugin, options));
//console.log(':: Keys :: ', Object.keys(plugin))
//console.log(':: TABLE ::', plugin.servers[0].table())
        next();
    }
};

module.exports.register.attributes = {
    name: 'hapi-lantern',
    version: '0.0.0'
};


internals.copyLayouts = function copyLayouts (path) {

    var sourcePath = Path.join(internals.basePath, 'layouts');
    var destinationPath = Path.join(internals.views.basePath, internals.views.layoutPath);

    Fs.mkdir(destinationPath, function (err) {

        Fs.readdir(sourcePath, function createSymLinks (err, files) {

            files.map(function createSymLink (file) {

                var source = Path.join(sourcePath, file);
                var destination = Path.join(destinationPath, file);

                Fs.symlink(source, destination, function (err) { });
            });
        });
    });
};


internals.registerDeck = function registerDeck (plugin, options) {

    return function (deck) {

        if (deck.type.toUpperCase() === 'REVEAL') {
            return internals.registerRevealDeck(plugin, options, deck);
        }
    };
};


internals.registerRevealDeck = function (plugin, options, deck) {

    var viewOptions = {
        layout: 'reveal'
    };

    var context = {
        title: deck.title,
        description: deck.description,
        theme: deck.theme
    };

    var revealRoute = {
        method: 'GET',
        path: deck.paths.route,
        handler: function (request, reply) {

            reply.view(deck.filename, context, viewOptions);
        }
    };

    plugin.route(revealRoute);
};
