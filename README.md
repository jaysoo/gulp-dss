# gulp-dss

A plugin for Gulp to generate UI documentation with DSS Parser

## Basic Usage

```javascript
var dss = require('gulp-dss');

gulp.task('dss', function() {
  return gulp.src('app/assets/stylesheets/**/*.{sass,scss}')
    .pipe(dss({ output: 'index.html' }))
    .pipe(gulp.dest('ui-docs/'));
});
```
