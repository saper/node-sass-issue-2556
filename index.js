var nodeSass = require('node-sass');
var path = require('path');
var fs = require('fs');

var prevMap = {};

var i = 0;
var importer = function (request, prev, done) {
  if (request) {
    var fileName = null,
      buff = "";

    if (prev == "stdin") {
      fileName = path.join(__dirname, 'assets');
      fileName = path.join(fileName, request);
    }
    else {
      var dirname = path.dirname(prevMap[prev]) // #1 with buff
      // var dirname = path.dirname(prev); // #2 with fileName
      fileName = path.join(dirname, request);
    }

    if (fileName) {
      prevMap[request] = fileName;

      fileName += ".scss";
      buff = fs.readFileSync(fileName, 'utf8');
    }


    var uniqueFilename = 'file' + (i++);
    done({
      contents: buff, // #1
      // file: uniqueFilename  // not working too
      // file: fileName // #2
    });
  } else {
    done();
  }
}

var source = `@import "a/a";
@import "b/b";
h1 {
  @include redFOFO;
  @include italicFOFO;
};`;

var options = {
  importer: importer,
  data: source
}


nodeSass.render(options, function (error, result) {
  if (error) {
    throw error;
  }
  else {
    console.log(result.css.toString());
  }
});
