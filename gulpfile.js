const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const watch = require('gulp-watch')

gulp.task('sass-compile', function(){
    return gulp.src('./assets/styles/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/styles/css'))
})

gulp.task('watch', function (paams) {
    gulp.watch('./assets/styles/scss/**/*.scss', gulp.series('sass-compile'))
})

