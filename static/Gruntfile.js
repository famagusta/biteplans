// Gruntfile.js

module.exports = function(grunt) {

    var mozjpeg = require('imagemin-mozjpeg');

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
        
        bower_concat: {
            build:{
                dest: 'dist/js/bower.js',
                src: 'bower_components/jquery/dist/jquery.min.js'
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
                    'dist/css/bitePlans.css': ['stylesheets/index.css',         
                                               'stylesheets/landingPage.css',
                                               'stylesheets/searchPlan.css',
                                               'stylesheets/starRating.css',
                                               'stylesheets/navbar.css',
                                               'stylesheets/footer.css',
                                               'stylesheets/dashboard.css',
                                               'stylesheets/createPlan.css',
                                               'stylesheets/searchIngredients.css',
                                               'stylesheets/ingredientResult.css',
                                               'stylesheets/recipes.css',
                                               'stylesheets/createRecipe.css']
                }
            }
        },
        
        imageoptim: {
          myTask: {
            src: ['./images', 'dist/images']
          }
        }

        
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-imageoptim');



    
    grunt.registerTask('default', ['ngAnnotate','uglify', 'cssmin', 'imagemin'])        

}

