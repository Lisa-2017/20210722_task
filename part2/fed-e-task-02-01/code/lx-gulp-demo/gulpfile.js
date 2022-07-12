const { src, dest, parallel, series, watch } = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')()
const del = require('del')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync')
const browser = browserSync.create() // 创建一个热更新的服务器

const styles = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(dest('dist'))
    .pipe(browser.reload({ stream: true }))
}
const scripts = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(gulpLoadPlugins.babel({ presets: ['@babel/env'] }))
    .pipe(dest('dist'))
    .pipe(browser.reload({ stream: true }))
}
const pages = () => {
  return src('src/*.html')
    .pipe(gulpLoadPlugins.swig())
    .pipe(dest('dist'))
    .pipe(browser.reload({ stream: true }))
}
const images = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(gulpLoadPlugins.imagemin())
    .pipe(dest('dist'))
}
const fonts = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(gulpLoadPlugins.imagemin())
    .pipe(dest('dist'))
}
const othersFile = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist/public'))
}

// const combination = parallel(styles, scripts, pages, images, fonts, othersFile)


const clean = () => {  // del 返回的promise对象，可以作为gulp任务结束的标记
  return del(['dist'])
}

const serve = () => {
  // 监视开发中文件的变换，从而执行对应的gulp任务
  watch('src/assets/styles/*.scss', styles)
  watch('src/assets/scripts/*.js', scripts)
  watch('src/*.html', pages)
  watch('src/assets/images/**', browser.reload)
  watch('src/assets/fonts/**', browser.reload)
  watch('public/**', browser.reload)
  browser.init({
    port: 5000,
    notify: false,
    // 一旦dist文件下的内容改变，浏览器就会自动刷新，显示最新数据，热更新，
    // 可以用browser-sync提供的reload()方法来实现
    // files: 'dist/**',
    server: { // 将内置的静态服务器用于基本的HTML / JS / CSS网站
      baseDir: ['dist', 'src', 'public'], // // 从来往后依次查找，找到就直接用
      // 开发阶段，解决dist目录下，文件内引用的样式、js不起作用的问题
      // 线上阶段用useref可以处理html文件中的构建注释，也可以实现压缩
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  // 找到dist目录下的所有的html文件，判断文件内的构建注释里的链接是哪种类型，从而进行处理
  // 因为从dist取文件，编制后在放入dist目录，会起冲突，所以需要一个临时目录temp来存储对应的文件
  // temp目录是临时目录，打包之后还是要放入dist目录内才行
  // 所以需要对所有任务内的入口和出口进行调整
  // gulpLoadPlugins.useref({ searchPath: ['temp', '.'] }) 查找的是html文件内的构建注释引用的位置
  return src('temp/*.html', { base: 'temp' })
    .pipe(gulpLoadPlugins.useref({ searchPath: ['temp', '.'] }))
  //gulp-if=>判断文件流中是哪种文件，然后就进行相应的压缩,都是从html中构建注释获取的文件类型
    //TODO: 由于受到sass影响  现在uglify、cleanCss、htmlmin方法在gulpLoadPlugins中已经找不到了
    // .pipe(gulpLoadPlugins.if(/\.js$/, gulpLoadPlugins.uglify())) 
    // .pipe(gulpLoadPlugins.if(/\.css$/, gulpLoadPlugins.cleanCss()))
    // .pipe(gulpLoadPlugins.if(/\.html$/, gulpLoadPlugins.htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })))
    .pipe(dest('dist'))
}

const combination = parallel(styles, scripts, pages)

const dev = series(clean, combination, serve)

const build = series(clean, parallel(series(combination, useref)), images, fonts, othersFile)

module.exports = {
  clean,
  dev,
  build,
  combination,
  useref

}
