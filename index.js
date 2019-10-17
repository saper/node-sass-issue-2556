var nodeSass = require('node-sass');
var path = require('path');
var fs = require('fs');

var dir_of_origin = {};

var i = 0;
var importer = function (request, prev, done) {
  if (request) {
    var fileName = null,
      buff = "";

    console.log(i + ' >> Request: ' + request);
    console.log(i + ' >> Prev: ' + prev);
    console.log(i + ' >> dir_of_origin: ' + JSON.stringify(dir_of_origin));
    console.log(i + ' >> dir_of_origin value: ' + dir_of_origin[prev]);
    if (prev == "stdin") {
      fileName = path.join(__dirname, 'assets');
      fileName = path.join(fileName, request);
    }
    else {
      var dirname = dir_of_origin[prev] // #1 with buff
      // var dirname = path.dirname(prev); // #2 with fileName
      fileName = path.join(dirname, request);
    }

    if (fileName) {
      dir_of_origin[request] = path.dirname(fileName);

      fileName += ".scss";
      buff = fs.readFileSync(fileName, 'utf8');
    }


    done({
      contents: buff,
      file: request
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
