module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n"use strict";'
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
                  banner: '#!/usr/bin/env node\n/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n"use strict";'
              },
              files: [{
                  src: 'src/prak',
                  dest: 'bin/prak'
              }]
          }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};
