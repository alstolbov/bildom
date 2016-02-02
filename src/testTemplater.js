var linkTpl = function(){/*
  <div class="one" style="color: #666; opacity: 1" onclick="a">
    <div style="color: #333; font-style: italic;')">
      <span>[[text]]</span>
      <a href="#">1</a>
    </div>
    <div>
      <span>[[bg]]</span>
    </div>
  </div>
*/};

var funct = {
  a: function () {
    console.log('!!!');
  }
};

Buildom._com.domGen(
  {bg: 'some.jpg', text: 'some'},
  linkTpl,
  function (dom) {
    Buildom._com.mountElement(document.getElementById('rootNode'), dom);
  }
);
