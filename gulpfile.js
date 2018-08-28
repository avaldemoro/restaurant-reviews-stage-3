var gulp = require('gulp');
var uglify = require('gulp-uglify-es').default;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function() {
    console.log('hello there!');
});

gulp.task('js', () => {
  return gulp.src(['js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function (done) {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'));
    done();
});
