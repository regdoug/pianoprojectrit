module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    found: grunt.file.readJSON('bower_components/foundation/bower.json'),
    jq: grunt.file.readJSON('bower_components/jquery/bower.json'),
    cdn: '//cdn.jsdelivr.net/',

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }        
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      }
    },

    'string-replace': {
      dist: {
        files: {
          'dist/':'dist/index.html'
        },
        options: {
          replacements: [
            {pattern: /{{\s*VERSION\s*}}/g, replacement: '<%= pkg.version %>'},
            {pattern: /\/bower_components\/(foundation|modernizr)\//g, replacement: '<%= cdn %>foundation/<%= found.version %>/'},
            {pattern: '/bower_components/jquery/dist/jquery.min.js', replacement: '//ajax.googleapis.com/ajax/libs/jquery/<%= jq.version %>/jquery.min.js'},
            {pattern: /\/bower_components/g, replacement: '/vendor'},
            {pattern: /^.*="\/js\/(?!app).*\n/gm, replacement: ''}
            /* remove separate js files and replace with app.js */
          ]
        }
      }
    },

    concat: {
      dist: {
        files: {
          'dist/js/app.js':'js/*.js'
        }
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        files: {
          'dist/js/app.min.js': 'dist/js/app.js',
        }
      }
    },

    copy: {
      dist: {
        files: [
          {src: ['index.html', 'robots.txt'], dest: 'dist/'},
          {src: 'css/app.css', dest: 'dist/'},
          {src: 'img/*', dest: 'dist/', expand:true},
          {expand: true, cwd: 'bower_components/', src: ['d3/d3.js', 'd3-tip/index.js'], dest: 'dist/vendor/'}
        ]
      }
    },

    clean: ['dist/'],
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('dist', ['clean', 'concat', 'uglify', 'copy', 'string-replace']);  
  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build','watch']);
}
