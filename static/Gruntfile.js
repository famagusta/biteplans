// Gruntfile.js

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },

            build:['Gruntfile.js', 'javascripts/**/*.js']
        },

        ngAnnotate: {
            build: {
                
                files: [{
                        expand: true,
                        src: ['javascripts/**/*.js', '!javascripts/**/*.annotated.js'],
                        dest: 'javascripts/annotated/',
                        ext: '.annotated.js',
                        extDot: 'last'
                    }],
            }
        },

        //configure uglify to minify js files
        uglify: {
            options: {
                banner: '/*\n <% pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build:{
                src: 'javascripts/annotated/**/*.annotated.js',
                dest: 'dist/js/build.js'

            }
        },

        //configure cssmin to minify css files
        cssmin:{
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build:{
                files: {
                    'dist/css/bitePlans.css': 'stylesheets/**/*.css'
                }
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.registerTask('default', ['ngAnnotate','uglify', 'cssmin'])        

}

