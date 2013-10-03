var template = require('..')
var fs = require('fs');
var find = require('find');
var assert = require('assert');

function read(file) {
  if (/\.data$/.test(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf-8') || "{}") 
  }
  return fs.readFileSync(file, 'utf-8');
}

describe('tiny-tempalte', function() {
  var reg = /\.input$/;
  var ext = ['input', 'parse', 'output', 'data']; 
  find
    .fileSync(reg, './test/cases')
    .map(function(file) {
      var obj = {};
      ext.forEach(function(tail) {
        obj[tail] = file.split(reg)[0] + '.' + tail;
      })
      return obj;
    })
    .forEach(function(t) {
      it('should parse ' + t.input,  function() {
        var parsed = JSON.stringify(
          template.parse(read(t.input)), null, 2
        );
        assert.equal(parsed, read(t.parse));
      });
      it('should compile ' + t.input, function() {
        var compiled = template.compile(
          read(t.input), read(t.data)
        );
        assert.equal(compiled, read(t.output))
      });
    });
})
