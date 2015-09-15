var gulp = require('gulp'),
    streamqueue = require('streamqueue'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-ruby-sass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('sass', function() {
    return streamqueue({ objectMode: true },
        sass('src/sass/application.css.scss')
    )
    .pipe(concat('site.css'))
    .pipe(gulp.dest('css'))
    .pipe(minifyCSS())
    .pipe(rename({ extname: '.min.css' }))
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

gulp.task('default', ['build'])
