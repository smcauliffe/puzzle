module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // copy all non js and sass to dist
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: [
              '**',
              '!**/*.js',
              '!**/*.scss',
              '!**/sass/**'
            ],
            cwd: 'src',
            dest: 'dist/'
          }
        ]
      }
    },

    // concat js
    concat: {
      options: {
        separator: '\n;' // was ; places new line between different files to avoid conflicts
      },
      dist: {
        src: [
          'bower_components/lodash/dist/lodash.min.js',
          'bower_components/interact/dist/interact.min.js',
          'src/js/main.js'
        ],
        dest: 'dist/js/app.min.js'
      }
    },

    // minify or "uglify" javascript files
    uglify: {
      dist: {
        files: {
          'dist/js/app.min.js': ['<%= concat.dist.dest %>'] // dist/<%= pkg.name %>.min.js
        }
      }
    },

    watch: {
      default: {
        files: [
          '<%= concat.dist.src %>',
          'src/**/*',
          'Gruntfile.js'
        ],
        tasks: ['copy', 'concat', 'compass']
      }
    },

    //Connect local host.
    connect: {
      server: {
        options: {
          port: 8000
        }
      }
    },

    compass: {
      common: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'dist/css',
          outputStyle: 'compressed',
          force: true
        }
      }
    }
  });

  // Load externally defined tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task
  grunt.registerTask(
    'default',
    'Watches the project for changes, automatically builds them and runs a server.',
    ['connect', 'copy', 'concat', 'compass', 'watch:default']
  );

};
