/* globals module, require,
 |
 |------------------------------------------------------------------------------
 | Grunt Setup
 |------------------------------------------------------------------------------
 |
 | Define Grunt settings and tasks.
 |
 */
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'dist/seamless.js': ['src/seamless.js']
                }
            },
            dist_min: {
                options: {
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'dist/seamless.min.js': ['src/seamless.js']
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
};
