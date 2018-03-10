var gulp = require('gulp');
var concat = require('gulp-concat'),
    rjs = require('gulp-requirejs'),
    babel = require('gulp-babel');

gulp.task('join', function() {
    return gulp.src([
        './src/js/service.js',
        './src/js/classfieldsController.js',
        './src/js/editController.js',
        './src/js/index.js',
        './src/js/configViews.js',
    ])
    .pipe(concat('dashboard.js'))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['join'])
});