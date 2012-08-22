/*global module*/

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: '<json:package.json>',

    // delete the dist folder
    delete: {
      dist: {
        dest: '<%= pkg.dist %>'
      }
    },

    copy: {
      scripts: {
        src: '<%= pkg.src %>scripts/',
        dest: '<%= pkg.dist %>scripts/',
      },
      libs: {
        src: '<%= pkg.src %>scripts/libs/',
        dest: '<%= pkg.dist %>scripts/libs/',
      },
      img: {
        src: '<%= pkg.src %>img/',
        dest: '<%= pkg.dist %>img/',
      }
    },

    lint: {
      scripts: ['<%= pkg.src %>!(libs)**/*.js']
    },

    jshint: {
      options: {
        
      }
    },

    // compile Less to CSS
    /*
    less: {
      dist: {
        src: '<%= pkg.src %>styles/bootstrap.less',
        dest: '<%= pkg.dist %>/styles/styles.css'
      }
    },
    */

    // compile templates
    template: {
      directives: {
        src: '<%= pkg.src %>/scripts/directives/templates/**/*.template',
        dest: '<%= pkg.dist %>/scripts/directives/templates/',
        ext: '.html'
      },
      dev: {
        src: '<%= pkg.src %>**/*.template',
        dest: '<%= pkg.dist %>',
        ext: '.html',
        environment: 'dev',
        indent_size: 1,
        indent_char: '\t',
        max_char: 10000
      },
      prod: {
        src: '<config:template.dev.src>',
        dest: '<config:template.dev.dest>',
        ext: '<config:template.dev.ext>',
        environment: 'prod',
        minify: true
      }
    },

    // optimizes files managed by RequireJS
    requirejs: {
      scripts: {
        baseUrl: './dist/scripts/',
        findNestedDependencies: true,
        include: 'requireLib',
        mainConfigFile: './dist/scripts/main.js',
        name: 'main',
        optimize: 'uglify',
        out: './dist/scripts/scripts.min.js',
        paths: {
          requireLib: 'libs/require'
        },
        preserveLicenseComments: false,
        uglify: {
          no_mangle: true
        }
      },
      styles: {
        baseUrl: './dist/styles/',
        cssIn: './dist/styles/styles.css',
        optimizeCss: 'standard',
        out: './dist/styles/styles.min.css'
      }
    },

    watch: {
      less: {
        files: '<%= pkg.src %>styles/**/*.less',
        tasks: 'less'
      },
      template: {
        files: '<config:template.dev.src>',
        tasks: 'template:dev'
      }
    },

    server: {
      app: {
        src: './webserver.js',
        port: 8081,
        watch: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-less');
  grunt.loadNpmTasks('grunt-hustler');
  grunt.registerTask('core', 'delete copy lint');
  grunt.registerTask('bootstrap', 'core template:dev');
  grunt.registerTask('default', 'bootstrap');
  grunt.registerTask('dev', 'bootstrap watch');
  grunt.registerTask('prod', 'core template:directives requirejs template:prod');
};