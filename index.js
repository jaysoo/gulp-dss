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
  var nunjucksPath = opts.templatePath || path.join(__dirname, 'templates');
  var nunjucksOpts = {
    watch: false,
  };

  nunjucks.configure(nunjucksPath, nunjucksOpts);

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
      var newFile = new File({
        cwd: firstFile.cwd,
        path: opts.output,
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
