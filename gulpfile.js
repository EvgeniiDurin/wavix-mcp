import gulp from "gulp"
import swc from "gulp-swc"
import sourcemaps from "gulp-sourcemaps"
import { deleteAsync } from "del"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const paths = {
  src: "src/**/*.ts",
  dest: "build",
  resources: "src/resources/**/*.{json,md}"
}

const swcOptions = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: false,
      decorators: true,
      dynamicImport: true
    },
    target: "es2022",
    keepClassNames: true,
    baseUrl: join(__dirname, "src"),
    paths: {
      "@root/*": ["./*"],
      "@config/*": ["./config/*"],
      "@interfaces/*": ["./interfaces/*"],
      "@helpers/*": ["./helpers/*"],
      "@tools/*": ["./tools/*"],
      "@api/*": ["./api/*"],
      "@resources/*": ["./resources/*"]
    }
  },
  module: {
    type: "es6",
    strict: true,
    strictMode: true
  },
  sourceMaps: true
}

export async function clean() {
  return deleteAsync([paths.dest])
}

export function compile() {
  return gulp
    .src(paths.src)
    .pipe(sourcemaps.init())
    .pipe(swc(swcOptions))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dest))
}

export function copyResources() {
  return gulp.src(paths.resources, { base: "src" }).pipe(gulp.dest(paths.dest))
}

export function watchFiles() {
  gulp.watch(paths.src, compile)
}

export const build = gulp.series(clean, gulp.parallel(compile, copyResources))
export const watch = gulp.series(build, watchFiles)

export default build
