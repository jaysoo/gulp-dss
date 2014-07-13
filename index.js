'use strict';

var through = require('through');
var Buffer = require('buffer').Buffer;
var File = require('gulp-util').File;
var path = require('path');
var nunjucks = require('nunjucks');
var dss = require('dss');

function plugin(opts) {
  if (opts === undefined) throw new Error('Missing options');

  var firstFile = null;
  var contents = null;

  nunjucks.configure(opts.templatePath || path.join(__dirname, 'templates'));

  function process(file) {
    var parseOptions = {};

    dss.parse(file.contents.toString(), parseOptions, function(dssFile) {
      firstFile = firstFile || file;
      contents = contents || [];

      if (isBlank(dssFile)) return;

      dssFile.blocks.filter(validBlock).forEach(function(block) {
        contents.push(render('module.html', block));
      });

      function isBlank(dssFile) {
        return dssFile.blocks.length === 0;
      }

      function validBlock(block) {
        return block.name !== undefined;
      }
    });
  }

  function endStream() {
    if (firstFile) {
      var joinedPath = path.join(firstFile.base, opts.output);

      var newFile = new File({
        cwd: firstFile.cwd,
        base: firstFile.base,
        path: joinedPath,
        contents: new Buffer(wrapContents(contents.join('\n')))
      });

      this.emit('data', newFile);
    }

    this.emit('end');
  }

  function wrapContents(content) {
    return render('base.html', {content: content});
  }

  return through(process, endStream);
}

function render(templateName, context) {
  return nunjucks.render(templateName, context);
}

module.exports = plugin;
