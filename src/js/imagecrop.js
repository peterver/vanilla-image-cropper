var ImageCropper = (function() {

//
//  VARIABLES
//

  var src_el;
  var src_dim = function(val) {return src_el.getBoundingClientRect()[val];};

  var handles     = [];
  var handles_cbs = [
    function (e) {  //  TOP LEFT
        dim.w += dim.x - e.x;
        dim.h += dim.y - e.y;
        dim.x = e.x;
        dim.y = e.y;
    },
    function (e) {  //  TOP RIGHT
      dim.w = e.x - dim.x;
      dim.h += dim.y - e.y;
      dim.y = e.y;
    },
    function (e) {  //  BOTTOM RIGHT
      dim.w = e.x - dim.x;
      dim.h = e.y - dim.y;
    },
    function (e) {  //  BOTTOM LEFT
      dim.w += dim.x - e.x;
      dim.x = e.x;
      dim.h = e.y - dim.y;
    },
    function (e) {  //  TOP
      dim.h += dim.y - e.y;
      dim.y = e.y;
    },
    function (e) {  //  RIGHT
      dim.w = e.x - dim.x;
    },
    function (e) {  //  BOTTOM
      dim.h = e.y - dim.y;
    },
    function (e) {  //  LEFT
      dim.w += dim.x - e.x;
      dim.x = e.x;
    }
  ];
  var handles_wrap;

  var overlay;
  var overlay_el;

  var canvas        = null;

  var initialized   = false;
  var has_focus     = false;
  var dim           = {x: 0, y: 0, w: 80, h: 80};
  var opts          = {};
  var img           = null;

  function ImageCropper(selector, img_src, tmp_opts) {
    if(!img_src || !selector) return;
    src_el = document.querySelector(selector);
    //  Add classname only if necessary
    src_el.className += (' '+src_el.className+' ').indexOf(' imgc ') > -1 ? '' : ' imgc';
    //  Parse opts
    tmp_opts = tmp_opts ? tmp_opts : {};
    opts['update'] = ('update' in tmp_opts) ? tmp_opts['update'] : false;
    opts['max_width'] = ('max_width' in tmp_opts) ? tmp_opts['max_width'] : 500;
    opts['max_height'] = ('max_height' in tmp_opts) ? tmp_opts['max_height'] : 500;

    img = new Image();
    img.addEventListener('load', function(evt) {
      this.create();
    }.bind(this));
    img.src = img_src;
  }

//
//  PUBLIC FUNCTIONALITY
//

  ImageCropper.prototype.create = function() {
    if(initialized) return;
    var w = img.width;
    var h = img.height;
    if(w > opts['max_width']){
      h = Math.floor( opts['max_width'] * h / w );
      w = opts['max_width']
    }
    if(h > opts['max_height']){
      w = Math.floor( opts['max_height'] * w / h );
      h = opts['max_height'];
    }

    src_el.style.width = w + 'px';
    src_el.style.height = h + 'px';

    //  Canvas for cropping
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    src_el.appendChild(canvas);

    src_el.appendChild(img);
    img.width = w;
    img.height = h;

    //  Build overlay
    overlay = document.createElementNS('http://www.w3.org/2000/svg','svg');
    overlay.setAttribute('height',src_dim('height'));
    overlay.setAttribute('width',src_dim('width'));
    src_el.appendChild(overlay);

    overlay_el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    overlay_el.style.fill = 'rgba(0, 0, 0, .8)';
    overlay.appendChild(overlay_el);

    //  Build handlers
    handles_wrap = document.createElement('div');
    handles_wrap.className = 'imgc-handles';
    src_el.appendChild(handles_wrap);

    handles = [];
    for (var i = 0; i < 8; i++) {
      handles.push(new Handle(Math.floor(i/4), i%4, handles_cbs[i]));
      handles_wrap.appendChild(handles[i].el);
    }

    src_el.addEventListener('mousedown', master_mousedown);

    initialized = true;
    draw();
  };

  ImageCropper.prototype.destroy = function() {
    if(!initialized) return;

    while (src_el.firstChild) { src_el.removeChild(src_el.firstChild); }
    src_el.removeEventListener('mousedown', master_mousedown);

    canvas = img = handles_wrap = handles = overlay = overlay_el = null;
    initialized = false;
  };

  ImageCropper.prototype.crop = function(mime_type, quality) {
    if(!mime_type || (mime_type !== 'image/jpeg' && mime_type !== 'image/png')) {mime_type = 'image/jpeg';}
    if(!quality || quality < 0 || quality > 1) {quality = 1;}

    var tmp = { x: dim.x, y: dim.y, w: dim.w , h: dim.h };

    canvas.setAttribute('width', tmp.w);
    canvas.setAttribute('height', tmp.h);
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    //  TODO !
    ctx.drawImage(img, tmp.x, tmp.y, tmp.w, tmp.h, 0, 0, tmp.w, tmp.h);
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

    if(opts['update']) { opts['update'](dim); }
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
    var cb          = cb;
    var type        = t;
    var dir         = i;

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
    this.el.className = 'imgc-handles-el-' + type + '-' + dir;
    this.el.addEventListener('mousedown', handle_down);
  };

  return ImageCropper;
})();