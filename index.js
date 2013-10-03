
exports.parse = parse;
exports.compile = compile;


/** 
 *  Parser for the common code statment.
 *
 *  format: 
 *    name (data, arg1, arg2) 
 */
function parseOperator(str) {
  var match = str.match(/^(\w+)\s+\((.+)\)\s*$/) || []
  var args = match[2] && match[2].split(/,\s*/g) || [];
  return {
    name: match[1] || '',
    data: args[0] || '',
    args: args.slice(1) || []
  }
}

/**
 * Normailize the whole template string into a series of segments.
 */
function flatten(template) {
  var ret = [];
  template
    .split(/<%\s*/)
    .forEach(function(line) {
      var group = line.split(/\s*%>/);
      ret = ret.concat(group.map(function(g, idx) {
        if (idx || group.length == 1) {
          return {text: g};
        }
        if (/^=/.test(g)) {
          return {variable: g.replace(/^=\s*/, '')}; 
        }
        if (/^end$/.test(g)) {
          return {codeEnd: true}
        }
        return {codeStart: parseOperator(g)};
      }));
    });
  return ret;
} 
 
/**
 * Turn the template string into a parsed tree object.
 */
function parse(template) {
  var flat = flatten(template);  
  var stack = [{block: []}];
  flat.forEach(function(line) {
    if (line.codeStart) {
      return stack.push({ 
        operator: line.codeStart,
        block: []
      });
    }
    if (line.codeEnd) {
      return stack[stack.length - 2].block.push(stack.pop());
    }
    stack[stack.length - 1].block.push(line);
  });
  return stack[0];
}

/**
 *  Recursively interpretering the template based on the parsed tree.
 */
function compose(tree, scope) {
  scope = scope || {};
  var ret = [];
  tree.block.forEach(function(line) {  
    var text = line.text;
    var variable = line.variable;
    var operator = line.operator;
    if (text) {
      ret.push(text);    
    }
    if (variable) {
      var value = scope[variable];
      ret.push(value !== undefined ? value : '' );
    }
    if (operator) {
      switch(operator.name) {
        // if
        case 'if': 
          if (scope[operator.data]) {
            ret.push(compose(line, scope));
          }
        // each
        case 'each': 
          (scope[operator.data] || []).forEach(function(data) {
            var _scope = {};
            var args = [].slice.call(arguments);
            operator.args.forEach(function(d, i) {
              _scope[d] = args[i];
            });
            ret.push(compose(line, _scope));
          });
      }
    }
  });
  return ret.join('');
}

/**
 * Compling with the given template and data object. 
 */
function compile (template, data) {
  var tree = parse(template);
  return compose(tree, data);
};

