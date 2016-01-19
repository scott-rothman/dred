module.exports = function(grunt) {

  // Report elapsed execution time of grunt tasks.
  require('time-grunt')(grunt);

  grunt.initConfig({

    config: {
      src: 'app',
      dev: 'www'
    },

    // watch
    //--------------------------------------------------------------
    // Watches for changed files and runs appropriate tasks

    watch: {
      markup: {
        files: ['<%= config.src %>/**/*.{hbs,json}'],
        //tasks: ['assemble:utility', 'assemble:headerfooter', 'assemble:manage', 'assemble:styleguide']
        tasks: ['assemble']
      },
      styles: {
        files: ['<%= config.src %>/assets/scss/**/*.scss'],
        tasks: ['compass:dev']
      },
      copy: {
        files: ['<%= config.src %>/assets/js/**/*.js'],
        tasks: ['newer:copy:statics']
      }
    },

    // assemble
    //--------------------------------------------------------------
    // Compiles Handlebars templates to static HTML

    assemble: {
      options: {
        layout: 'main.hbs',
        layoutdir: '<%= config.src %>/templates/layouts/',
        partials: '<%= config.src %>/templates/partials/**/*.hbs'
      },
      pages: {
        files: [{
          cwd: '<%= config.src %>/pages/',
          dest: '<%= config.dev %>',
          expand: true,
          src: ['**/*.hbs']
        }]
      }
    },


    // compass
    //--------------------------------------------------------------

    compass: {
      dev: {
        options: {
          sassDir: '<%= config.src %>/assets/scss',
          cssDir: '<%= config.dev %>/css',
          imagesDir: 'images',
          javascriptDir: 'js',
          fontsDir: 'css/fonts',
          httpImagesPath: 'images',
          httpFontsPath: 'fonts',
          relativeAssets: false,
          assetCacheBuster: false,
          outputStyle: 'expanded',
          noLineComments: false
        }
      }
    },

    // copy
    //--------------------------------------------------------------
    // Put files not handled in other tasks here

    copy: {
      statics: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/assets/js/',
            src: ['*.js'],
            dest: '<%= config.dev %>/js/'
          }
        ]
      }
    }
  });

  // Load plugins to provide the necessary tasks
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-jscs');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('base', ['clean','assemble','copy']);
  grunt.registerTask('default', ['base', 'compass:dev']);
  grunt.registerTask('start', ['default', 'watch']);
};