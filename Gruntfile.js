module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */\n"use strict";'
            },
            build: {
                files: [{
                  expand: true,
                  cwd: 'src/',
                  src: '**/*.js',
                  dest: 'build/'
              }]
          },
          bin: {
              options: {
                  banner: '#!/usr/bin/env node\n/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                          '<%= grunt.template.today("yyyy-mm-dd") %> */\n"use strict";'
              },
              files: [{
                  src: 'src/prak',
                  dest: 'bin/prak'
              }]
          }
      },
      clean: ['bin/', 'build/']
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);
};
