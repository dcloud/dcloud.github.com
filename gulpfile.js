var gulp = require('gulp'),
    streamqueue = require('streamqueue'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-ruby-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('sass', function() {
    return streamqueue({ objectMode: true },
        gulp.src('node_modules/normalize.css/normalize.css'),
        sass('src/sass/application.css.scss')
    )
    .pipe(concat('site.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('css'))
});


gulp.task('build', ['sass'])

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(['index.html', 'src/sass/*.scss', 'src/sass/lib/base/*.scss'], ['sass', reload]);
});