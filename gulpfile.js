/*------------------------------------------------------------
	使用するモジュール
------------------------------------------------------------*/
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'), // ベンダープレフィックスを付与
      postcss = require('gulp-postcss'),
      babel = require("gulp-babel"),

      rollup = require('gulp-rollup'),
      ruNodeResolve = require("rollup-plugin-node-resolve"), // npmでnode_modulesにインストールされたものを扱えるようにする
      ruCommonjs = require("rollup-plugin-commonjs"), // CommonJSモジュールをES6に変換
      ruBabel = require("rollup-plugin-babel"),

      concat = require('gulp-concat'), // ファイルをまとめる
      uglify = require('gulp-uglify'), // JavaScriptを縮小する
      plumber = require('gulp-plumber'), // エラー時にwatchが停止するのを阻止
      sassGlob = require('gulp-sass-glob'), // sassの複数の@importを一つにまとめる
      csscomb = require('gulp-csscomb'),
      csslint = require('gulp-csslint'), // 構文チェック
      mqpacker = require("css-mqpacker"), // 同じメディアクエリーをまとめる
      notify = require('gulp-notify'), // エラーの通知
      watch = require('gulp-watch'), // ファイル監視
      imagemin = require('gulp-imagemin'), // イメージ圧縮
      pngquant = require('imagemin-pngquant'),
      mozjpeg = require('imagemin-mozjpeg'),
      runSequence = require('run-sequence'),
      pug = require('gulp-pug');


/*------------------------------------------------------------
	各パスの定義
------------------------------------------------------------*/
const root = {
      DEST: './dist/',
      SRC: './src/'
};

const path = {
      SASS_DEST: root.DEST + 'assets/css/',
      PUG_DEST: root.DEST,
      JS_DEST: root.DEST + 'assets/js/',
      IMG_DEST: root.DEST + 'assets/images/',

      NOT_SRC: '!./src/',
      SASS_SRC: root.SRC + 'sass/**/*.sass',
      PUG_SRC: root.SRC + 'html/',
      JS_SRC: root.SRC + 'js/**/*.js',
      IMG_SRC: root.SRC + 'images/**/*'
};


/*------------------------------------------------------------
	PUGのコンパイル
------------------------------------------------------------*/
gulp.task('pug', () => {
  return gulp.src([path.PUG_SRC + '**/*.pug', '!' + path.PUG_SRC + '**/_*.pug'])
    .pipe(plumber()).pipe(pug({
      basedir: path.PUG_SRC,
      pretty: true
    }))
    .pipe(gulp.dest(path.PUG_DEST))
});


/*------------------------------------------------------------
	SASSのコンパイル
------------------------------------------------------------*/
gulp.task('sass', () => {
  gulp.src(path.SASS_SRC)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>') // gulp-notifyでエラーの通知
    }))
    .pipe(sassGlob()) // @importにおけるglobを有効にする
    .pipe(sass({
      style: 'expanded' // 通常のCSSで出力
    }))
    .pipe(csslint()) // 構文チェック
    .pipe(csscomb()) // gulp-csscombでcssを整形
    .pipe(postcss([
      require('autoprefixer')({
        browsers: ['last 4 versions', 'ff ESR', 'ie 9']
      }),
      require('css-mqpacker'), // 同じメディアクエリーをまとめる
    ]))
    .pipe(gulp.dest(path.SASS_DEST))
});


/*------------------------------------------------------------
	JSファイル
------------------------------------------------------------*/
gulp.task('js', () => {
  gulp.src([path.JS_SRC , path.NOT_SRC + 'js/plugins/**.js'])
    .pipe(babel())
    // .pipe(rollup({
    //   rollup: require('rollup'),
    //   allowRealFiles: true,
    //   input: src(path.JS_SRC),
    //   output: {
    //     file: dest(path.JS_DEST),
    //     format: 'umd',
    //   },
    //   plugins: [
    //     ruNodeResolve(), // npmでnode_modulesにインストールされたものを扱えるようにする
    //     ruCommonjs(), // CommonJSモジュールをES6に変換
    //     ruBabel() // ES5
    //   ]
    // }))
    .pipe(gulp.dest(path.JS_DEST))
});

// plugins.js
gulp.task('pjs', () => {
  return gulp.src(path.NOT_SRC + 'js/plugins/**.js')
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.JS_DEST));
});


/*------------------------------------------------------------
 イメージ圧縮
 --イメージ画像を圧縮する。
------------------------------------------------------------*/
gulp.task('img', () => {
  gulp.src(path.IMG_SRC)
    .pipe(imagemin(
      [
      pngquant({
        quality: '65-80',
        speed: 1,
        floyd:0
      }),
      mozjpeg({
        quality: 85,
        progressive: true
      }),
      imagemin.svgo(),
      imagemin.optipng(),
      imagemin.gifsicle()
      ]
    ))
    .pipe(gulp.dest(path.IMG_DEST))
});


/*------------------------------------------------------------
	ファイル監視
------------------------------------------------------------*/
gulp.task('w', () => {

  watch([path.SASS_SRC], event => {
    gulp.start(['sass']);
  });

  watch([path.PUG_SRC], event => {
    gulp.start(['pug']);
  });

  watch([path.JS_SRC], event => {
    gulp.start(['js']);
  });

  watch([path.IMG_SRC], event => {
    gulp.start(['img']);
  });

});


/*------------------------------------------------------------
	gulpコマンド
------------------------------------------------------------*/
gulp.task('default', callback => {
  return runSequence(
    ['pug', 'sass', 'js', 'pjs', 'img'],
    callback);
});
