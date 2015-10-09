module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['build/', 'generated/'],
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
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('generate-grammar', function () {
        var done = this.async();
        require('fs').writeFile(
            'generated/parser.js',
            require('./tools/generate-grammar.js').output(),
            function (err) {
                if (err)
                    done(false);
                else
                    done();
            }
        );
    });

    grunt.registerTask('create-directories', function () {
        grunt.file.mkdir('build/');
        grunt.file.mkdir('generated/');
    });

    grunt.registerTask('default', ['create-directories', 'generate-grammar', 'uglify']);
};
