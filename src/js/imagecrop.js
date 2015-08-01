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
      dim.w = e.x - dim.x;
      handles_cbs[4](e);
    },
    function (e) {  //  BOTTOM RIGHT [2]
      dim.w = e.x - dim.x;
      dim.h = e.y - dim.y;
    },
    function (e) {  //  BOTTOM LEFT [3]
      handles_cbs[7];
      dim.h = e.y - dim.y;
    },
    function (e) {  //  TOP [4]
      dim.h += dim.y - e.y;
      dim.y = e.y;
    },
    function (e) {  //  RIGHT [5]
      dim.w = e.x - dim.x;
    },
    function (e) {  //  BOTTOM [6]
      dim.h = e.y - dim.y;
    },
    function (e) {  //  LEFT [7]
      dim.w += dim.x - e.x;
      dim.x = e.x;
    }
  ];

//
//  VARIABLES
//

  var src_el;
  var src_dim = function(val) {return src_el.getBoundingClientRect()[val];};

  var handles_wrap;
  var overlay_el;
  var canvas        = null;

  var initialized   = false;
  var has_focus     = false;
  var dim           = {x: 0, y: 0, w: 80, h: 80};
  var opts          = {};
  var img           = null;
  var ratio         = {w:1,h:1};

  function ImageCropper(selector, img_src, tmp_opts) {
    if(!img_src || !selector) return;
    //  Parse opts
    parseOptions(tmp_opts);
    //  Get parent
    getParent(selector);
    //  Load image
    img = new Image();
    img.addEventListener('load', function(evt) {
      this.create();
    }.bind(this));
    img.src = img_src;
  };

  var parseOptions = function(tmp_opts) {
    tmp_opts = tmp_opts ? tmp_opts : {};
    for (var key in pos_opts) { opts[pos_opts[key][0]] = (key in tmp_opts) ? tmp_opts[key] : pos_opts[key][1]; }
  };

  var getParent = function(selector) {
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
    //  Set w_h_ratio to use in processing afterwards ( this is based on original image size )
    w_h_ratio = {w: img.naturalWidth/w, h: img.naturalHeight/h};

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

    //  Build overlay
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

    for (var i = 0; i < 8; i++) {
      var handle = new Handle(~~(i/4), i%4, handles_cbs[i]);
      handles_wrap.appendChild(handle.el);
    }

    src_el.addEventListener('mousedown', master_mousedown);

    initialized = true;
    draw();
    if(opts.cr) { opts.cr(dim); }
  };

  ImageCropper.prototype.destroy = function() {
    if(!initialized) return;

    if(src_el) {
      src_el.removeEventListener('DOMNodeRemovedFromDocument', this.destroy);
      src_el.removeEventListener('mousedown', master_mousedown);

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
      w_h_ratio.w * dim.x, w_h_ratio.h * dim.y, w_h_ratio.w * dim.w, w_h_ratio.h * dim.h,
      0, 0, dim.w, dim.h
    );
    return canvas.toDataURL(mime_type, quality);
  };

//
//  EVENTS
//

  function convertGlobalToLocal(e) {
    var x = e.clientX - src_dim('left'), y = e.clientY - src_dim('top');
    return {
      x : x < 0 ? 0 : (x > src_dim('width') ? src_dim('width') : x),
      y : y < 0 ? 0 : (y > src_dim('height') ? src_dim('height') : y)
    }
  };

  function collisionCheck() {
    if(opts.fs) { dim.w = dim.h; }
    dim.w = (dim.w < 32) ? 32 : dim.w;
    dim.h = (dim.h < 32) ? 32 : dim.h;
    dim.x = (dim.x < 0) ? 0 : (dim.x + dim.w > src_dim('width') ? (src_dim('width') - dim.w) : dim.x);
    dim.y = (dim.y < 0) ? 0 : (dim.y + dim.h > src_dim('height') ? (src_dim('height') - dim.h) : dim.y);
  };

  function draw() {
    handles_wrap.style.top = dim.y + 'px';
    handles_wrap.style.left = dim.x + 'px';
    handles_wrap.style.width = dim.w + 'px';
    handles_wrap.style.height = dim.h + 'px';

    overlay_el.setAttribute('d', 'M 0 0 v' + src_dim('height') + 'h' + src_dim('width') + 'v' + -src_dim('height') + 'H-0zM' + dim.x + ' ' + dim.y + 'h' + dim.w + 'v' + dim.h + 'h-' + dim.w + 'V-' + dim.h + 'z');

    if(opts.up) { opts.up(dim); }
  };

  function update(evt) {
    evt = convertGlobalToLocal(evt);
    dim.x = evt.x - dim.w*.5;
    dim.y = evt.y - dim.h*.5;
    collisionCheck();
    draw();
  };

  function master_mousedown(evt) {
    if(has_focus) return;
    document.addEventListener('mousemove', master_mousemove);
    document.addEventListener('mouseup', window_blur);
    update(evt);
    has_focus = true;
  };

  function window_blur(evt) {
    if(!has_focus) return;
    document.removeEventListener('mouseup', window_blur);
    document.removeEventListener('mousemove', master_mousemove);
    has_focus = false;
  };

  function master_mousemove(evt) {
    if(!has_focus) return;
    update(evt);
  };

//
//  HANDLE
//

  function Handle(t, i, cb) {
    var has_focus   = false;

    //  EVENTS

    function handle_down(e) {
      e.stopPropagation();
      has_focus = true;
      document.addEventListener('mouseup', handle_up);
      document.addEventListener('mousemove', handle_move);
    };

    function handle_move(e) {
      e.stopPropagation();
      if(has_focus) {
        cb(convertGlobalToLocal(e));
        collisionCheck();
        draw();
      }
    };

    function handle_up(e) {
      e.stopPropagation();
      has_focus = false;
      document.removeEventListener('mouseup', handle_up);
      document.removeEventListener('mousemove', handle_move);
    };

    this.el = document.createElement('span');
    this.el.className = 'imgc-handles-el-' + t + '-' + i;
    this.el.addEventListener('mousedown', handle_down);
  };

  return ImageCropper;
})();