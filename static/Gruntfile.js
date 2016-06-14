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
        
        concat_css: {
            options: {
              // Task-specific options go here. 
            },
            all: {
              src: ["./bower_components/angular-material/angular-material.min.css",
                    "./stylesheets/biteplans_icons_and_fonts.css",
                    
                   "./bower_components/materialize/dist/css/materialize.min.css",
//                    "./bower_components/font-awesome/css/font-awesome.min.css",
                   "./bower_components/material-calendar/angular-material-calendar.min.css"],
              dest: "dist/css/libraries.css"
            },
          },

        
        concat: {
          options: {
            separator: ';',
          },
          js_frontend: {
            src: [ './bower_components/jquery/dist/jquery.min.js',
                    './bower_components/angular/angular.min.js',
                   './bower_components/angular-http-loader/app/package/js/angular-http-loader.min.js',
                  './bower_components/materialize/dist/js/materialize.min.js',
                  './bower_components/angular-materialize/src/angular-materialize.js',
                  './bower_components/satellizer/satellizer.min.js',
                  './bower_components/angular-animate/angular-animate.min.js',
                  './bower_components/angular-route/angular-route.min.js',
                  './bower_components/angular-aria/angular-aria.min.js',
                  './bower_components/angular-sanitize/angular-sanitize.min.js',
                  './bower_components/angular-material/angular-material.min.js',
                  './bower_components/material-calendar/angular-material-calendar.min.js',
                  './bower_components/angular-paging/dist/paging.min.js',
                  './bower_components/moment/min/moment.min.js',
                  './bower_components/angular-svg-round-progressbar/build/roundProgress.min.js'
            ],
            dest: 'dist/js/lib/libraries.js',
          },
          
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
                src: './bower_components/jquery/dist/jquery.min.js'
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
                    'dist/css/bitePlans.css': [
                        'stylesheets/index.css',         
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

    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-imageoptim');



    grunt.registerTask('default', ['concat_css','concat', 'ngAnnotate','uglify', 'cssmin'])        

}
