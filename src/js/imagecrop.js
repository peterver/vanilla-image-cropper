module.exports = (function() {

  //  Used to setup the options for the ImageCropper
  var pos_opts = {
    'update': ['up',false],
    'create_cb' : ['cr',false],
    'destroy_cb' : ['de', false],
    'max_width' : ['mw',500],
    'max_height' : ['mh',500],
    'fixed_size' : ['fs',false]
  };

  //  Callback handlers used for every handle and their cbs
  var handles_cbs = [
    function (e) {  //  TOP LEFT [0]
      handles_cbs[7](e);
      handles_cbs[4](e);
    },
    function (e) {  //  TOP RIGHT [1]
      handles_cbs[5](e);
      handles_cbs[4](e);
    },
    function (e) {  //  BOTTOM RIGHT [2]
      handles_cbs[5](e);
      handles_cbs[6](e);
    },
    function (e) {  //  BOTTOM LEFT [3]
      handles_cbs[7](e);
      handles_cbs[6](e);
    },
    function (e) {  //  TOP [4]
      dim.y = (dim.y2 - e.y < 32 ? dim.y2 - 32 : e.y);
    },
    function (e) {  //  RIGHT [5]
      dim.x2 = (e.x - dim.x < 32 ? dim.x + 32 : e.x);
    },
    function (e) {  //  BOTTOM [6]
      dim.y2 = (e.y - dim.y < 32 ? dim.y + 32 : e.y);
    },
    function (e) {  //  LEFT [7]
      dim.x = (dim.x2 - e.x < 32 ? dim.x2 - 32 : e.x);
    }
  ];

//
//  VARIABLES
//

  var src_el;

  var handles_wrap;
  var overlay_el;
  var canvas        = null;

  var initialized   = false;
  var dim           = {x: 0, y: 0, x2: 80, y2: 80, w: 80, h: 80};
  var opts          = {};
  var img           = null;
  var ratio         = {w:1,h:1};

  function ImageCropper(selector, img_src, tmp_opts) {
    if(!img_src || !selector) return;
    //  Parse options
    tmp_opts = tmp_opts ? tmp_opts : {};
    for (var key in pos_opts) { opts[pos_opts[key][0]] = (key in tmp_opts) ? tmp_opts[key] : pos_opts[key][1]; }
    //  Get parent
    setParent(selector);
    //  Load image
    img = new Image();
    img.addEventListener('load', function(evt) {
      this.create();
    }.bind(this));
    img.src = img_src;
  };

  var setParent = function(selector) {
    if(src_el) { this.destroy(); }
    src_el = document.querySelector(selector);
    src_el.className += (' imgc ').indexOf(' '+opts.cn+' ') > -1 ? '' : (' imgc');
  }

//
//  PUBLIC FUNCTIONALITY
//

  ImageCropper.prototype.create = function(selector) {
    if(initialized) return;
    if(!src_el) setParent(selector);

    //  Calculate width and height based on max-width and max-height
    var w = img.width, h = img.height;

    if(w > opts.mw) {
      h = ~~(opts.mw*h/w);
      w = opts.mw
    }
    if(h > opts.mh) {
      w = ~~(opts.mh*w/h);
      h = opts.mh;
    }
    //  Set ratio to use in processing afterwards ( this is based on original image size )
    ratio = {w: img.naturalWidth/w, h: img.naturalHeight/h};

    src_el.style.width = w + 'px';
    src_el.style.height = h + 'px';
    src_el.addEventListener('DOMNodeRemovedFromDocument', this.destroy);

    //  Canvas for cropping
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    src_el.appendChild(canvas);
    //  Image for seeing
    src_el.appendChild(img);

    //  Build SVG overlay
    var overlay = document.createElementNS('http://www.w3.org/2000/svg','svg');
    overlay.setAttribute('height',h);
    overlay.setAttribute('width',w);
    src_el.appendChild(overlay);

    overlay_el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    overlay_el.style.fill = 'rgba(0, 0, 0, .8)';
    overlay.appendChild(overlay_el);

    //  Build handlers
    handles_wrap = document.createElement('div');
    handles_wrap.className = 'imgc-handles';
    src_el.appendChild(handles_wrap);

    for (var i = 0; i < (opts.fs ? 4 : 8); i++) {
      handles_wrap.appendChild(new Handle(opts.fs ? 0 : ~~(i/4), i%4, handles_cbs[i]));
    }

    src_el.addEventListener('mousedown', document_mousedown);

    initialized = true;
    render({x: 0, y: 0});
    if(opts.cr) { opts.cr({w: w, h: h}); }
  };

  ImageCropper.prototype.destroy = function() {
    if(!initialized) return;

    if(src_el) {
      src_el.removeEventListener('DOMNodeRemovedFromDocument', this.destroy);
      src_el.removeEventListener('mousedown', document_mousedown);

      while (src_el.firstChild) { src_el.removeChild(src_el.firstChild); }
      src_el = canvas = img = handles_wrap = overlay_el = null;
    }

    initialized = false;
    if(opts.de) { opts.de(); }
  };

  ImageCropper.prototype.crop = function(mime_type, quality) {
    if(!mime_type || (mime_type !== 'image/jpeg' && mime_type !== 'image/png')) {mime_type = 'image/jpeg';}
    if(!quality || quality < 0 || quality > 1) {quality = 1;}

    canvas.setAttribute('width', dim.w);
    canvas.setAttribute('height', dim.h);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img,
      ratio.w * dim.x, ratio.h * dim.y, ratio.w * dim.w, ratio.h * dim.h,
      0, 0, dim.w, dim.h
    );
    return canvas.toDataURL(mime_type, quality);
  };

//
//  UTILITY / DIMENSIONAL CHECKS
//

    function convertGlobalToLocal(e) {
      var d = src_el.getBoundingClientRect();
      var x = e.clientX - d.left, y = e.clientY - d.top;
      return {
        x : x < 0 ? 0 : (x > d.width ? d.width : x),
        y : y < 0 ? 0 : (y > d.height ? d.height : y)
      }
    };

    function render() {
      var d = src_el.getBoundingClientRect();
      //  boundary check
      if(dim.x < 0) {
        dim.x = 0;
        dim.x2 = dim.w;
      }
      if(dim.y < 0) {
        dim.y = 0;
        dim.y2 = dim.h;
      }
      if(dim.x2 > d.width) {
        dim.x2 = d.width;
        dim.x = dim.x2 - dim.w;
      }
      if(dim.y2 > d.height) {
        dim.y2 = d.height;
        dim.y = dim.y2 - dim.h;
      }
      //  Set w/h for future use
      dim.w = dim.x2 - dim.x;
      dim.h = dim.y2 - dim.y;

      //  Draw
      handles_wrap.style.top = dim.y + 'px';
      handles_wrap.style.left = dim.x + 'px';
      handles_wrap.style.width = dim.w + 'px';
      handles_wrap.style.height = dim.h + 'px';

      overlay_el.setAttribute('d', 'M 0 0 v' + d.height + 'h' + d.width + 'v' + -d.height + 'H-0zM' + dim.x + ' ' + dim.y + 'h' + dim.w + 'v' + dim.h + 'h-' + dim.w + 'V-' + dim.h + 'z');

      if(opts.up) { opts.up(dim); }
    };

    function update(e) {
      e = convertGlobalToLocal(e);
      dim.x = e.x - dim.w*.5;
      dim.y = e.y - dim.h*.5;
      dim.x2 = e.x + dim.w*.5;
      dim.y2 = e.y + dim.h*.5;
      render();
    };

//
//  EVENTS
//

    function document_mousedown(e) {
      document.addEventListener('mousemove', document_mousemove);
      document.addEventListener('mouseup', window_blur);
      update(e);
    };

    function window_blur(e) {
      document.removeEventListener('mouseup', window_blur);
      document.removeEventListener('mousemove', document_mousemove);
    };

    function document_mousemove(e) {
      update(e);
    };

//
//  HANDLE
//

  function Handle(t, i, cb) {
    function handle_down(e) {
      e.stopPropagation();
      document.addEventListener('mouseup', handle_up);
      document.addEventListener('mousemove', handle_move);
    };

    function handle_move(e) {
      e.stopPropagation();
      cb(convertGlobalToLocal(e));
      render();
    };

    function handle_up(e) {
      e.stopPropagation();
      document.removeEventListener('mouseup', handle_up);
      document.removeEventListener('mousemove', handle_move);
    };

    var el = document.createElement('span');
    el.className = 'imgc-handles-el-' + t + '-' + i;
    el.addEventListener('mousedown', handle_down);
    return el;
  };

  return ImageCropper;
})();