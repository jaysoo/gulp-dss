# gulp-dss

A plugin for Gulp to generate UI documentation with DSS Parser.

## Basic Usage

```javascript
var dss = require('gulp-dss');

gulp.task('dss', function() {
  return gulp.src('app/assets/stylesheets/**/*.{sass,scss}')
    .pipe(dss({
      output: 'index.html',
      templatePath: path.join(__dirname, 'templates')
    }))
    .pipe(gulp.dest('ui-docs/'));
});
```

## Templates

The **templatePath** option points to the folder containing the templates.

You *should* create your own `module.html` and `base.html`, but there are some default ones provided.

The `module.html` template is rendered with the Generated Object from [DSS](https://github.com/darcyclarke/DSS).

The `base.html` template is rendered the `content`.

The template engine used is [Nunjucks](http://mozilla.github.io/nunjucks/).

## Roadmap

- Write better readme
- Provide better default templates that automatically include the stylesheets

