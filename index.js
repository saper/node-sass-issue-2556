var nodeSass = require('node-sass');
var path = require('path');
var fs = require('fs');

var file_of_origin = {};

var i = 0;
var importer = function (request, prev, done) {
  if (request) {
    var fileName = null, dir_name = null
      buff = "";

    console.log(i + ' >> Request: ' + request);
    console.log(i + ' >> Prev: ' + prev);
    console.log(i + ' >> file_of_origin: ' + JSON.stringify(file_of_origin));
    console.log(i + ' >> file_of_origin value: ' + file_of_origin[prev]);

    var base_dir = path.join(__dirname, 'assets');

    if (prev in file_of_origin) {
      dir_name = path.dirname(file_of_origin[prev])
    } else {
      dir_name = '';
    }

    var relative_file_name = path.join(dir_name, request);
    file_of_origin[request] = relative_file_name;

    var full_file_name = path.join(base_dir, relative_file_name + ".scss");
    console.log(i + ' >> reading file \"' + full_file_name + '\"');
    console.log(i + ' >> import name will be "' + relative_file_name + '\"');
    buff = fs.readFileSync(full_file_name, 'utf8');
    i ++;


    done({
      contents: buff,
      file: relative_file_name
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
