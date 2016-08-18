module.exports = function (grunt) {

    grunt.initConfig({
        svg2png: {
            all: {
                files: [
                    {cwd: 'i/svg/', src: ['**/*.svg'], dest: 'i/svg/'}
                ]
            }
        },
        watch: {
            templates: {
                files: ['jade/*.jade'],
                tasks: ['jade'],
                options: {
                    spawn: false
                }
            },
            //scripts: {
            //    files: ['js/*.js'],
            //    tasks: ['concat'],
            //    options: {
            //        spawn: false
            //    }
            //},
            styles: {
                files: ['sass/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'js/respond.min.js',
                    'js/jquery1.10.js',
                    'js/jquery-ui-1.11.4.js',
                    'js/select2.js',
                    'js/slick.js',
                    'js/script.js'
                ],
                dest: 'js/min/all.js'
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'expanded'
                },
                files: {
                    'styles/main_global.css': 'sass/main_global.scss'
                }
            }
        },
        jade: {
            compile: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [{
                    cwd: "jade/",
                    src: "*.jade",
                    dest: "",
                    expand: true,
                    ext: ".html"
                }]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['watch']);
};