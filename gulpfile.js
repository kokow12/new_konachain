
const gulp = require("gulp");
const src = "src";
const dist = "dist";
const port = 5065;
const path = {
    img: {
        src: src + "/images/",
        dist: dist + "/images/",
        exc: "!./images/sprite/*.*"
    },
    js: {
        src: src + "/js/*.js",
        dist: dist + "/js/"
    },
    scss: {
        src: src + "/sass/**/*.scss",
        result: src + "/sass/**/*.scss",
        dist: dist + "/css/",
        autoprefixer: dist + "/css/*.css"
    },
    sprite: {
        src: src + "/images/sprite/",
        dist: dist + "/images/sprite/",
        css: src + "/sass/vendor/"
    },
    html: {
        src: src + "/html/**/*.html",
        dist: dist + "/html/",
        exc: "!./html/include/**/*.html"
    }
}

//공용
const browserSync = require("browser-sync").create(),
    reload = browserSync.reload,
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del"),
    fs = require('fs'),
    paths = require('path');


//js min 파일생성
const minify = require("gulp-minify");
function minJs(){
    return gulp
        .src(path.js.src)
        .pipe(minify({
            ext: {
                min: ".min.js"
            }
        }))
        .pipe(gulp.dest(path.js.dist))
        .pipe(browserSync.stream({match: "**/*.js"}))
        .on("finish", reload);
}


//브라우저 싱크
function bs(){
    browserSync.init({
        /*proxy: "localhost"*/
        server: {
            baseDir: dist,
            //index: "./html/index.html"
            directory:true
        },
        port: port,
        ui: {port: port + 1},
        ghostMode: false
    });
}



//이미지 스프라이트 폴더설정
const spritesmith = require("gulp.spritesmith");
const getFolders = function (dir_path) {
    return fs.readdirSync(dir_path).filter(function (file) {
        return fs.statSync(paths.join(dir_path, file)).isDirectory();
    });
};
//이미지 스프라이트
async function spriteIcon(){
    //초기값 설정
    var imgName = "sprite.",
        cssName = "_sprite.",
        padding = 5,
        cssTemplate = "sprite.css.handlebars",
        layout = 'left-right',
        folders = getFolders(path.sprite.src); //폴더별 스프라이트생성

    //폴더없이 메인루트일때
    var spriteData = gulp.src(path.sprite.src + "*.*")
        .pipe(spritesmith({
            imgName: imgName + "png",
            cssName: cssName + "scss",
            padding: padding,
            cssTemplate: cssTemplate
        }));
    spriteData.img.pipe(gulp.dest(path.sprite.dist));
    spriteData.css.pipe(gulp.dest(path.sprite.css));

    //폴더별 스프라이트생성
    folders.forEach(function (folder) {
        spriteData = gulp.src(path.sprite.src + folder + '/*.png')
            .pipe(spritesmith({
                imgName: imgName + folder + '.png',
                cssName: cssName + folder + '.scss',
                padding: padding,
                //algorithm: layout,
                cssTemplate: cssTemplate
            }));
        spriteData.img.pipe(gulp.dest(path.sprite.dist));
        spriteData.css.pipe(gulp.dest(path.sprite.css));
    });
}


//gulp-sass
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");//벤더프리픽스 설정
const dgbl = require("del-gulpsass-blank-lines"); //compact 모드 라인 삭제
function gulpSass(){
    return gulp
        .src(path.scss.result)
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true, outputStyle: "compressed"}).on("error", sass.logError)) //nested compact expanded compressed
        //.pipe(dgbl()) //compact 라인삭제
        /*.pipe(autoprefixer({
            browsers: [
                "ie >= 7",
                "last 10 Chrome versions",
                "last 10 Firefox versions",
                "last 2 Opera versions",
                "iOS >= 7",
                "Android >= 4.1"
            ],
            cascade: true,
            remove: false
        }))*/
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(path.scss.dist))
        .pipe(browserSync.stream({match: "**/*.css"}))
        .on("finish", reload);
}

//html 브라우저 호환성 css 추가변경
function autopreFixer(){
    return gulp.src(path.scss.autoprefixer)
        .pipe(autoprefixer({
            browsers: [
                "ie >= 10",
                "last 10 Chrome versions",
                "last 10 Firefox versions",
                "last 2 Opera versions",
                "iOS >= 10",
                "Android >= 4.4"
            ],
            cascade: true,
            remove: false
        }))
        .on("finish", reload);
}


//이미지 압축
var imagemin = require("gulp-imagemin");
function imgMin(){
    return gulp
        .src([path.img.src, path.img.exc])
        .pipe(imagemin())
        .pipe(gulp.dest(path.img.dist))
        .on("finish",reload);
}


//html 파일 include
const include = require("gulp-html-tag-include");
function includeHTML(){
    return gulp.src(path.html.src)
        .pipe(include())
        .pipe(gulp.dest(path.html.dist))
        .on("finish", reload);
}


//이미지 복사
function imgCopy(){
    return gulp
        .src([path.img.src + "**/*.*","!"+path.sprite.src+"*.*","!"+path.sprite.src+"**/*.*"])
        .pipe(gulp.dest(path.img.dist))
        .pipe(browserSync.stream({match: "**/images/*.*"}))
        .on("finish", reload);
}

//clean-image
function imgClean(){return del(path.img.dist)}

//clean-html
function htmlClean(){return del(path.html.dist)}


//clean-html-include
function includeHtmlClean(){
    return del([path.html.dist + "**/include"])
}


// 파일 와치
function watchFiles(){
    gulp.watch(path.js.src, minJs);
    gulp.watch(path.scss.src, gulpSass);
    gulp.watch(path.html.src, html);
    gulp.watch(path.img.src, imgCopy);
    // gulp.watch(path.sprite.src + "*.png",spriteIcon);
};


// 취합 다중 실행
const watch = gulp.parallel(watchFiles,bs);
const imgUpdate = gulp.series(imgClean, imgCopy, spriteIcon);
const html = gulp.series(htmlClean,gulp.series(includeHTML,includeHtmlClean));
const build = gulp.series(imgUpdate,html, minJs , gulpSass);

// tasks 선언
exports.watch = watch;
exports.minJs = minJs;
exports.bs = bs;
exports.spriteIcon = spriteIcon;
exports.gulpSass = gulpSass;
exports.autopreFixer = autopreFixer;
exports.imgeMin =imgMin;
exports.includeHTML = includeHTML;
exports.includeHtmlClean = includeHtmlClean;
exports.imgCopy = imgCopy; //src 이미지를 dist폴도에 복사
exports.imgClean = imgClean; //dist 이미지폴더 내용 삭제
exports.htmlClean = htmlClean; // dist html 파일 삭제
exports.imgUpdate = imgUpdate; // 불필요한 이미지 삭제후 갱신
exports.html = html; // html include 취합
exports.build = build; // 배포하기위한 모든 작업
exports.default = watch; // 파일와치와 브라우저싱크 자동실행