module.exports = function(grunt) {
 
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //uglify 설정
        uglify: {
            options: {
                banner: '/*kim.jinhoon@nhn.com*/ ' //파일의 맨처음 붙는 banner 설정
            },
            build: {
                src: 'build/sketch.js', //uglify할 대상 설정
                dest: 'build/sketch.min.js' //uglify 결과 파일 설정
            }
        },
        //concat 설정
        concat:{
            basic: {
                src: [
                    'src/Sketch.js', 
                    'src/math/*.js',
                    'src/event/*.js', 
                    'src/display/DisplayObject.js',
                    'src/display/*.js'
                ], //concat 타겟 설정(앞에서부터 순서대로 합쳐진다.)

                dest: 'build/sketch.js' //concat 결과 파일
            }
        }
    });
 
    // Load the plugin that provides the "uglify", "concat" tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
 
    // Default task(s).
    grunt.registerTask('default', ['concat']); //grunt 명령어로 실행할 작업
 
};