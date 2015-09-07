module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['build/'],
        jison: {
            parser: {
                options: {

                },
                files: [{
                    src: 'src/grammar.jison',
                    dest: 'generated/parser.js'
                }]
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                            '<%= grunt.template.today("yyyy-mm-dd") %> */\n' +
                            '"use strict";'
                },
                files: [{
                  expand: true,
                  cwd: 'src/',
                  src: '**/*.js',
                  dest: 'build/'
              }, {
                expand: true,
                cwd: 'generated/',
                src: '**/*.js',
                dest: 'build/'
            }]
            },
            bin: {
                options: {
                    banner: '#!/usr/bin/env node\n' +
                            '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                            '<%= grunt.template.today("yyyy-mm-dd") %> */\n' +
                            '"use strict";'
                },
                files: [{
                    src: 'src/bin-prak',
                    dest: 'build/bin-prak'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jison');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jison', 'uglify']);
};
