var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var watch = require('gulp-watch');
gulp.task('uglify:js', function(){
	return gulp.src([
			'src/js/intro.js',
			'src/js/biPartite.js',
		])
		.pipe(concat('index.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});
gulp.task('concat:js', function(){
	return gulp.src([
			'src/js/intro.js',
			'src/js/biPartite.js',
		])
		.pipe(concat('index.min.js'))
		.pipe(gulp.dest('dist/js'));
});
gulp.task('uglify:css', function(){
	return gulp.src('src/css/*.css')
		.pipe(concat('style.css'))
		.pipe(uglifycss())
		.pipe(gulp.dest('dist/css'));
});
gulp.task('concat:css', function(){
	return gulp.src('src/css/*.css')
		.pipe(concat('style.css'))
		.pipe(gulp.dest('dist/css'));
});
gulp.task('watch', function(){
	gulp.watch(['src/js/*'], ['concat:js']);
	gulp.watch(['src/css/*'], ['concat:css']);
});


gulp.task('default', ['watch','concat:js', 'concat:css'], function(){
	return gulp.src('src/data/*')
		.pipe(gulp.dest('dist/data'));
});
gulp.task('release', ['uglify:js', 'uglify:css'], function(){
	return gulp.src('src/data/*')
		.pipe(gulp.dest('dist/data'));
});
