const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const sass         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const del          = require('del');

function browsersync(){
    browserSync.init({
        server:{baseDir: 'app/'},
        notify: false
    })
}

function styles() {
    return src("app/sass/**/*.scss")
        .pipe(sass())
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'], grid: true
        }))
        .pipe(cleancss(({
            level: { 1: {specialComments: 0} }
        })))
        .pipe(dest("app/css"))
        .pipe(browserSync.stream())
}

function images() {
    return src("app/images/src/**/*")
        .pipe(imagemin())
        .pipe(dest("app/images/final"))
}

function scripts(){
    return src([
        'app/js/index.js',
        "node_modules/jquery/dist/jquery.js"
    ])
        .pipe(concat("index.min.js"))
        .pipe(uglify())
        .pipe(dest("app/js/"))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        "app/css/**/main.min.css",
        "app/images/final/**/*",
        "app/**/*.html",
    ], { base : 'app'})
        .pipe(dest("dist"))
}

function cleanDist() {
    return del("dist/**/*", {force : true})
}

function startwatch(){
    watch(["app/**/*.js", "!app/**/*.min.js"], scripts);
    watch("app/sass/**/*.scss", styles);
    watch("app/**/*.html").on('change', browserSync.reload);
}

exports.build       = series(cleanDist, styles, scripts, images, build)
exports.images      = images;
exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.default     = parallel(styles, scripts, browsersync ,startwatch);