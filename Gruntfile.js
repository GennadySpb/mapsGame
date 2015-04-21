var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
    grunt.nodePath = '/opt/nodejs/0.10/bin/node';
    grunt.npmPath = '/opt/nodejs/0.10/bin/npm';

    if (!fs.existsSync(grunt.nodePath)) {
        grunt.nodePath = 'node';
        grunt.npmPath = 'npm';
    }

    var autoprefixer = require('autoprefixer-core');
    var vendors = [
        'react',
        'jquery',
        'underscore',
        'b_'
    ];
    var vendorsTest = vendors.concat(['chai', 'sinon']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            options: {
                transform: [require('reactify')],
                browserifyOptions: {
                    extensions: ['.jsx', '.js', '.json'],
                    noParse: ['jquery', 'underscore']
                }
            },
            vendor: {
                src: [],
                dest: 'build/vendors.js',
                options: {
                    browserifyOptions: {
                        ignoreMissing: true // promise-attempt/lib-cov
                    },
                    require: vendors
                }
            },
            client: {
                files: {
                    'build/main.built.js': ['app/app.jsx']
                },
                options: {
                    debug: true,
                    external: vendors,
                    alias: [
                        './app/config/config.js:config'
                    ]
                }
            },
            vendorTest: {
                src: [],
                dest: 'build/vendorTest.js',
                options: {
                    browserifyOptions: {
                        ignoreMissing: true // promise-attempt/lib-cov
                    },
                    require: vendorsTest
                }
            },
            test: {
                files: {
                    'build/test.built.js': ['app/tests/index.js']
                },
                options: {
                    external: vendorsTest,
                    alias: [
                        './app/config/config.js:config'
                    ]
                }
            }
        },

        // Собираем styl файл с испортами остальных файлов
        concat: {
            options: {
                process: function (src, filepath) {
                    return '@import "../' + filepath + '";';
                }
            },
            main: {
                files: {
                    'build/main.styl': ['app/styles/*.styl', 'app/components/**/*.styl']
                }
            }
        },

        // Первращаем styl в css резолвля относительные пути
        stylus: {
            options: {
                'resolve url': true,
                compress: false,
                linenos: true
            },
            main: {
                files: {
                    'build/main.css': ['build/main.styl']
                }
            }
        },

        // Прогоняем стили автопрефексером
        postcss: {
            options: {
                processors: [
                    autoprefixer({
                        browsers: [
                            '> 2%'
                        ]
                    }).postcss
                ]
            },
            main: {
                files: {
                    'build/_main.css': ['build/main.css']
                }
            }
        },

        borschik: {
            css: {
                src: ['build/_main.css'],
                dest: 'build/_main.min.css',
                options: {
                    minimize: true,
                    freeze: true,
                    tech: './node_modules/borschik-tech-cleancss/index'
                }
            },
            js: {
                src: ['build/main.built.js', 'build/vendors.js'],
                options: {
                    minimize: true,
                    freeze: false
                }
            }
        },

        copy: {
            main: {
                files: [
                    {expand: false, src: ['build/_main.css'], dest: 'build/_main.min.css'},
                    {expand: false, src: ['build/main.built.js'], dest: 'build/_main.built.js'},
                    {expand: false, src: ['build/vendors.js'], dest: 'build/_vendors.js'}
                ]
            }
        },

        watch: {
            client: {
                files: ['app/**/*.js', 'app/**/*.jsx'],
                tasks: ['browserify:client', 'copy']
            },
            test: {
                files: ['app/**/*.js', 'app/**/*.jsx', 'app/tests/*.js', 'app/tests/**/*.jsx'],
                tasks: ['browserify:test']
            },
            css: {
                files: ['app/components/**/*.styl', 'app/styles/*.styl'],
                tasks: ['css', 'copy']
            }
        },

        jscs: {
            options: {
                force: true,
                config: '.jscs.json',
                esprima: 'esprima-fb'
            },
            static: ['app/**/*.jsx', 'app/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-borschik');
    grunt.loadNpmTasks('grunt-jscs');

    // Загружаем локальные таски проекта
    //grunt.loadTasks('tasks');

    grunt.registerTask('css', ['concat:main', 'stylus:main', 'postcss:main']);
    grunt.registerTask('static', ['css', 'browserify', 'copy']);
    grunt.registerTask('prod', ['css', 'browserify', 'borschik:css', 'borschik:js']);
};
