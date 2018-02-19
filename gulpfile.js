var gulp = require('gulp');
var mocha = require("gulp-mocha");

gulp.task("test", function() {
  return gulp.src([
      "./test/bootstrap.test.js",
      "./test/integration/controllers/UserController.test.js",
      "./test/integration/controllers/ThemeController.test.js",
      "./test/integration/controllers/MessageController.test.js",
      "./test/integration/controllers/LikeController.test.js",
    ])
    .pipe(mocha());
});