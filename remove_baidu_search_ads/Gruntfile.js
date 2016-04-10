module.exports = function (grunt) {
  grunt.initConfig({
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
          "./index.es5.js": ["./index.es6.user.js"]
        }
      }
    },
    watch: {
      scripts: {
        files: ["./modules/*.js"],
        tasks: ["browserify"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("build", ["browserify"]);
};

