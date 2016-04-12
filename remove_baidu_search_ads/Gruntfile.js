module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('grunt-contrib-clean')(grunt);
  var meta = require('./src/meta');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Empties folders to start fresh
    clean: {
      dist: {
        src: ['./dist']
      },
      backup: {
        src: ['./backup']
      }
    },
    copy: {
      backup: {
        options: {
          timestamp: true
        },
        expand: true,
        src: 'dist/*',
        dest: 'backup/'
      }
    },
    less: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: './sass',
          src: [
            '**/*.less',
            '**/*.scss'
          ],
          dest: 'css',
          ext: '.css',
        }],
      }
    },
    browserify: {
      dist: {
        options: {
          transform: [
            ["babelify", {loose: "all"}]
          ]
        },
        files: {
          // if the source file has an extension of es6 then
          // we change the name of the source file accordingly.
          // The result file's extension is always .js
          // "./dist/module.js": ["./modules/index.js"]
          // "./dist/build.js": ["./modules/*.js"]
          "./dist/index.user.js": ["./index.js"]
        }
      }
    },
    concat: {
      options: {
        sourceMap: true,
        separator: ';',
      },
      dist: {
        src: ['./libs/*.js'],
        dest: './concat/lib.js',
      },
    },
    uglify: {
      dist: {
        options: {
          sourceMap: true,
          sourceMapName: './dist/index.map',
          // beautify: true,
          banner: meta.header,
          footer:meta.footer
        },
        files: {
          './dist/index.min.user.js': ['./dist/index.user.js']
        }
      }
    },
    watch: {
      scripts: {
        files: [
          "./index.js",
          "./libs/*.js",
          "./src/*.js"
        ],
        tasks: ["browserify"]
      }
    },
    // JS语法检查
    jshint: {
      all: [
        './*.js',
        './libs/*js',
        './src/*.js',
      ],
    },
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask("default", ["watch"]);

  grunt.registerTask("build", [
    'clean:backup',
    'copy:backup',
    'clean:dist',
    'browserify',
    // 'jshint:all',
    'uglify:dist'
  ]);
};

