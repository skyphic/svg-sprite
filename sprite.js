'use strict';

var SVGSpriter = require('svg-sprite');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var glob = require('glob');
var cwd = path.resolve('./src/svg/');

//スプライトを削除する
glob('*.svg', {cwd: cwd}, function (err, files) {
  files.forEach(function (file) {
    fs.unlink(cwd +'/'+ file, function (err) {
      if (err) throw err;
    });
  });
})

//cssファイルを削除する
glob('*.css', {cwd: cwd}, function (err, files) {
  files.forEach(function (file) {
    fs.unlink(cwd +'/'+ file, function (err) {
      if (err) throw err;
    });
  });
})

var spriterDir = 'spriter/*.svg';
var spriter = new SVGSpriter({
  mode: {
    "css": {
      "dest": "src/svg",
      "layout": "horizontal",
      "prefix": ".%s:before",
      "sprite": "spriter.svg",
      "dimensions": false,
      "render": {
        "css": {
          "dest": "spriter.css",
          "template": "src/svg/templ/templ.css"
        }
      }
    }
  }
});

buildSprite(spriterDir, spriter);


var monoDir = 'mono/*.svg';
var mono = new SVGSpriter({
  mode: {
    "css": {
      "dest": "src/svg",
      "layout": "horizontal",
      "prefix": ".%s:before",
      "sprite": "mono.svg",
      "dimensions": false,
      "render": {
        "css": {
          "dest": "mono.css",
          "template": "src/svg/templ/templ.css"
        }
      }
    }
  }
});

buildSprite(monoDir, mono);

function buildSprite(Dir, config) {
  glob(Dir, {cwd: cwd}, function (err, files) {

    files.forEach(function (file) {

      // Create and add a vinyl file instance for each SVG
      config.add(new File({
        path: path.join(cwd, file),							// Absolute path to the SVG file
        base: cwd,											// Base path (see `name` argument)
        contents: fs.readFileSync(path.join(cwd, file))		// SVG file contents
      }));
    })

    config.compile(function (error, result, data) {
      for (var type in result.css) {
        mkdirp.sync(path.dirname(result.css[type].path));
        fs.writeFileSync(result.css[type].path, result.css[type].contents);
      }
    });
  });
}