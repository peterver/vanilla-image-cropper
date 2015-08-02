(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ImageCropper = require('./imagecrop.min.js');

var dimensions = null;
var is_active = false;
var img_c = null;

var onUpdateHandler = function (dim) {
  dimensions = dim;
};

var onCropHandler = function() {
  var img = new Image();
  img.src = img_c.crop('image/jpeg', 1);
  img.width = dimensions.w;
  img.height = dimensions.h;
  var target = document.querySelector('.preview');
  while(target.firstChild) {
    target.removeChild(target.firstChild)
  }
  target.appendChild(img);
};

var onCreateHandler = function() {
  if(is_active) { return; }

  new ImageCropper('.test-imagecrop', 'img2.jpg', {
    update: onUpdateHandler
  });
  destroy_btn.style.display = 'initial';
  create_btn.style.display = 'none';

  is_active = true;
};

var onDestroyHandler = function() {
  if(!is_active) { return; }

  img_c.destroy();
  destroy_btn.style.display = 'none';
  create_btn.style.display = 'initial';

  is_active = false;
};

var crop_btn = document.querySelector('.crop-button');
crop_btn.addEventListener('click', onCropHandler);

var create_btn = document.querySelector('.create-button');
create_btn.addEventListener('click', onCreateHandler);
create_btn.style.display = 'none';

var destroy_btn = document.querySelector('.destroy-button');
destroy_btn.addEventListener('click', onDestroyHandler);

img_c = new ImageCropper('.test-imagecrop', 'img.jpg', {
  update: onUpdateHandler,
  fixed_size: true,
  create_cb: function(dim) {
    console.log('created - ', dim);
  },
  destroy_cb: function() {
    console.log('destroy');
  }
});
is_active = true;
},{"./imagecrop.min.js":2}],2:[function(require,module,exports){
module.exports=function(){function e(e,t,n){if(t&&e){n=n?n:{};for(var i in c)f[c[i][0]]=i in n?n[i]:c[i][1];y(e),g=new Image,g.addEventListener("load",function(e){this.create()}.bind(this)),g.src=t}}function t(e){var t=u.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top;return{x:0>n?0:n>t.width?t.width:n,y:0>i?0:i>t.height?t.height:i}}function n(){var e=u.getBoundingClientRect();f.fs&&(v.w=v.h),v.w=v.w<32?32:v.w,v.h=v.h<32?32:v.h,v.x=v.x<0?0:v.x+v.w>e.width?e.width-v.w:v.x,v.y=v.y<0?0:v.y+v.h>e.height?e.height-v.h:v.y,s.style.top=v.y+"px",s.style.left=v.x+"px",s.style.width=v.w+"px",s.style.height=v.h+"px",a.setAttribute("d","M 0 0 v"+e.height+"h"+e.width+"v"+-e.height+"H-0zM"+v.x+" "+v.y+"h"+v.w+"v"+v.h+"h-"+v.w+"V-"+v.h+"z"),f.up&&f.up(v)}function i(e){e=t(e),v.x=e.x-.5*v.w,v.y=e.y-.5*v.h,n()}function o(e){l||(document.addEventListener("mousemove",r),document.addEventListener("mouseup",h),i(e),l=!0)}function h(e){l&&(document.removeEventListener("mouseup",h),document.removeEventListener("mousemove",r),l=!1)}function r(e){l&&i(e)}function d(e,i,o){function h(e){e.stopPropagation(),u=!0,document.addEventListener("mouseup",d),document.addEventListener("mousemove",r)}function r(e){e.stopPropagation(),u&&(o(t(e)),n())}function d(e){e.stopPropagation(),u=!1,document.removeEventListener("mouseup",d),document.removeEventListener("mousemove",r)}var u=!1,s=document.createElement("span");return s.className="imgc-handles-el-"+e+"-"+i,s.addEventListener("mousedown",h),s}var u,s,a,c={update:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],max_width:["mw",500],max_height:["mh",500],fixed_size:["fs",!1]},m=[function(e){m[7](e),m[4](e)},function(e){v.w=e.x-v.x,m[4](e)},function(e){v.w=e.x-v.x,v.h=e.y-v.y},function(e){m[7],v.h=e.y-v.y},function(e){v.h+=v.y-e.y,v.y=e.y},function(e){v.w=e.x-v.x},function(e){v.h=e.y-v.y},function(e){v.w+=v.x-e.x,v.x=e.x}],w=null,p=!1,l=!1,v={x:0,y:0,w:80,h:80},f={},g=null,y=function(e){u&&this.destroy(),u=document.querySelector(e),u.className+=" imgc ".indexOf(" "+f.cn+" ")>-1?"":" imgc"};return e.prototype.create=function(e){if(!p){u||y(e);var t=g.width,i=g.height;t>f.mw&&(i=~~(f.mw*i/t),t=f.mw),i>f.mh&&(t=~~(f.mh*t/i),i=f.mh),w_h_ratio={w:g.naturalWidth/t,h:g.naturalHeight/i},u.style.width=t+"px",u.style.height=i+"px",u.addEventListener("DOMNodeRemovedFromDocument",this.destroy),w=document.createElement("canvas"),w.setAttribute("width",t),w.setAttribute("height",i),u.appendChild(w),u.appendChild(g);var h=document.createElementNS("http://www.w3.org/2000/svg","svg");h.setAttribute("height",i),h.setAttribute("width",t),u.appendChild(h),a=document.createElementNS("http://www.w3.org/2000/svg","path"),a.style.fill="rgba(0, 0, 0, .8)",h.appendChild(a),s=document.createElement("div"),s.className="imgc-handles",u.appendChild(s);for(var r=0;r<(f.fs?4:8);r++)s.appendChild(new d(f.fs?0:~~(r/4),r%4,m[r]));u.addEventListener("mousedown",o),p=!0,n(),f.cr&&f.cr(v)}},e.prototype.destroy=function(){if(p){if(u){for(u.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),u.removeEventListener("mousedown",o);u.firstChild;)u.removeChild(u.firstChild);u=w=g=s=a=null}p=!1,f.de&&f.de()}},e.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1),w.setAttribute("width",v.w),w.setAttribute("height",v.h);var n=w.getContext("2d");return n.drawImage(g,w_h_ratio.w*v.x,w_h_ratio.h*v.y,w_h_ratio.w*v.w,w_h_ratio.h*v.h,0,0,v.w,v.h),w.toDataURL(e,t)},e}();
},{}]},{},[1]);
