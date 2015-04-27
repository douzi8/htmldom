module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.initConfig({
    jshint: {
      all: [
        './htmldom.js',
        './lib/*.js',
        './beautify/*.js',
        './uglify/*.js',
        '!./lib/htmldom.front.js'
      ]
    }
  });
};