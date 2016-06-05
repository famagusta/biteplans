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

//        ngAnnotate: {
//            build: {
//                files: {
//                    'WithAnnotationsCtrl.js': ['WithoutAnnotationsCtrl.js']
//                },
//            }
//        }

        //configure uglify to minify js files
        uglify: {
            options: {
                banner: '/*\n <% pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build:{
                files: {
                    'dist/js/bitePlans.js': 'javascripts/bitePlans.js',
                    'dist/js/bitePlansConfig.js': 'javascripts/bitePlansConfig.js',
                    'dist/js/components/calendar/calendarController.js':        
                        'javascripts/components/calendar/calendarController.js',
                    'dist/js/components/calendar/calendarService.js':        
                        'javascripts/components/calendar/calendarService.js',
                    'dist/js/components/dashboard/dashboardController.js':        
                        'javascripts/components/dashboard/shortlistController.js',
                    'dist/js/components/dashboard/shortlistController.js':        
                        'javascripts/components/dashboard/shortlistController.js',
                    'dist/js/components/dashboard/summaryController.js':        
                        'javascripts/components/dashboard/summaryController.js',
                    'dist/js/components/dashboard/summaryService.js':        
                        'javascripts/components/dashboard/summaryService.js',
                    'dist/js/components/ingredient/ingredientsController.js':        
                        'javascripts/components/ingredient/ingredientsController.js',
                    'dist/js/components/plan/createPlanController.js':        
                        'javascripts/components/plan/createPlanController.js',
                    'dist/js/components/plan/planController.js':        
                        'javascripts/components/plan/planController.js',
                    'dist/js/components/plan/planService.js':        
                        'javascripts/components/plan/planService.js',
                    'dist/js/components/plan/viewPlanController.js':        
                        'javascripts/components/plan/viewPlanController.js',
                    'dist/js/components/recipe/createRecipeController.js':        
                        'javascripts/components/recipe/createRecipeController.js',
                    'dist/js/components/recipe/editRecipeController.js':        
                        'javascripts/components/recipe/editRecipeController.js',
                    'dist/js/components/recipe/recipesController.js':        
                        'javascripts/components/recipe/recipesController.js',
                    'dist/js/components/recipe/recipeService.js':        
                        'javascripts/components/recipe/recipeService.js',
                    'dist/js/components/recipe/viewRecipeController.js':        
                        'javascripts/components/recipe/viewRecipeController.js',
                    'dist/js/components/user_profile/profileController.js':        
                        'javascripts/components/user_profile/profileController.js',
                    'dist/js/components/user_profile/profileService.js':        
                        'javascripts/components/user_profile/profileService.js',
                }
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
    grunt.loadNpmTasks('ngAnnotate');
    grunt.registerTask('default', ['uglify', 'cssmin'])        

}

