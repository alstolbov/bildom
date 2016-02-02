Buildom._com.createElement = function (tag, _options, _content) {
  var node = document.createElement(tag);
  var options;
  var content;
  var tmp;

  if (arguments[2]) {
    options = _options;
    content = _content;
  } else {
    options = {};
    content = _options;
  }

  if (options && typeof options == 'object') {
    for (var ind in options) {
      switch (ind) {
        case 'onclick':
          node.onclick = options[ind];
          break;
        default:
          switch (typeof options[ind]) {
            case 'string':
              node.setAttribute(ind, options[ind]);
              break;
            case 'object':
              if (!options[ind].length) {
                tmp = '';
                for (var stls in options[ind]) {
                  tmp += stls + ':' + options[ind][stls] + ';';
                }
              }
              node.setAttribute(ind, tmp);
              break;
            default: break;
          }
      }
    }
  }

  if (content) {
    switch (typeof content) {
      case 'string':
        node.innerHTML = content;
        break;
      case 'object':
        if (content.length !== 0) {
            if (!content.length) {
              node.appendChild(content);
            } else {
              content.forEach(
                function (item) {
                  node.appendChild(item);
                }
              );
            }
        }
        break;
      default: break;
    }
    
  }
  return node;
}

Buildom._com.mountElement = function (rootNode, node) {
  rootNode.appendChild(node);
}

Buildom._com.replaceTag = function (str, find, replace, unIgnoreCaseRules) {
    var ignoreCase = unIgnoreCaseRules || true;
    var _token;
    var token = find;
    var newToken = replace;
    var i = -1;

    if ( typeof token === "string" ) {

        if ( ignoreCase ) {

            _token = token.toLowerCase();

            while( (
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
            ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }

        } else {
            return this.split( token ).join( newToken );
        }

    }
    return str;
}

Buildom._com.template = function (data, fnInput) {
    var res;
    var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;
    var fn = fnInput || data;
    var options = fnInput ? data : false;
        
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    var match = reCommentContents.exec(fn.toString());

    if (!match) {
        throw new TypeError('Multiline comment missing.');
    }

    res = match[1];

    if (options &&  typeof options == 'object') {
        for (var item in options) {
            res = Buildom._com.replaceTag(res, '[[' + item + ']]', options[item]);
        }
    }

    return res;
};

Buildom._com.makeid = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for ( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

Buildom._com.unflattenTree = function (arr) {
  var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['children'] = [];
  }


  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      if (mappedElem.parentId) {
        mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
      }
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
};

Buildom._com.parseNode = function (node, res, rootId) {
  res.iter++;
  res.nodeConter++;
  var id = Buildom._com.makeid();
  var nodeProps = {
    id: id,
    tagName: node.tagName,
    parentId: rootId || 0,
    children: null,
    attr: {}
  };

  for(var attr in node.attributes) {
    if (parseInt(attr, 10) >= 0) {
      // console.log(node.attributes[attr].name, node.attributes[attr].value);
      switch (node.attributes[attr].name) {
        case 'style':
          // console.log(node.style);
          nodeProps.attr.style = {};
          for(var k in node.style) {
            if (parseInt(k, 10) >= 0) {
              nodeProps.attr.style[node.style[k]] = node.style[node.style[k]];
            }
          }
          break;
        default:
          nodeProps.attr[node.attributes[attr].name] = node.attributes[attr].value;
      }
    }
  }

  if (!node.children[0]) {
    nodeProps.innerHTML = node.innerHTML;
  } else {
    for(var k in node.children) {
      if (typeof node.children[k] == 'object') {
        Buildom._com.parseNode(node.children[k], res, id);
      }
    }
  }

  res.data.push(nodeProps);
  res.iter--;
};

Buildom._com.createTree = function (str, done) {
  var resDOM = {
    iter: 0,
    nodeConter: 0,
    data: []
  };
  var oParser = new DOMParser();
  var oDOM = oParser.parseFromString(str, "text/html");
  var root = oDOM.body.children[0];
  // console.log(root);
  // mountElement(document.getElementById('rootNode'), root);
  Buildom._com.parseNode(root, resDOM);

  var timer = setTimeout(
    function() {
      if (!resDOM.iter) {
        clearTimeout(timer);
        // console.log(resDOM);
        var tree = Buildom._com.unflattenTree(resDOM.data);
        // console.log(tree);
        done(tree);
      }
    },
    400
  );
};

Buildom._com.buildNode = function (obj) {
  var res;
  var node;
  if (obj.length > 1) {
    res = [];
  }
  for(var i in obj) {
    node = Buildom._com.createElement(
      obj[i].tagName,
      obj[i].attr,
      obj[i].children && obj[i].children.length ?
        Buildom._com.buildNode(obj[i].children) :
        obj[i].innerHTML
    );

    if (obj.length > 1) {
      res.push(node);
    } else {
      res = node;
    }
  }

  return res;
};

Buildom._com.buildDOM = function (obj, done) {
  console.log(obj);
  var domTree = Buildom._com.buildNode(obj);
  done(domTree);
};

Buildom._com.domGen = function (options, tpl, done) {
  Buildom._com.createTree(
    Buildom._com.template(options, tpl),
    function (treeObj) {
      Buildom._com.buildDOM(
        treeObj,
        function (dom) {
          done(dom)
        }
      )
    }
  );
}