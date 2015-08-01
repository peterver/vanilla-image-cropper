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
module.exports=function(){function e(e,t,n){t&&e&&(E(n),L(e),x=new Image,x.addEventListener("load",function(e){this.create()}.bind(this)),x.src=t)}function t(e){var t=e.clientX-l("left"),n=e.clientY-l("top");return{x:0>t?0:t>l("width")?l("width"):t,y:0>n?0:n>l("height")?l("height"):n}}function n(){y.fs&&(g.w=g.h),g.w=g.w<32?32:g.w,g.h=g.h<32?32:g.h,g.x=g.x<0?0:g.x+g.w>l("width")?l("width")-g.w:g.x,g.y=g.y<0?0:g.y+g.h>l("height")?l("height")-g.h:g.y}function i(){a.style.top=g.y+"px",a.style.left=g.x+"px",a.style.width=g.w+"px",a.style.height=g.h+"px",c.setAttribute("d","M 0 0 v"+l("height")+"h"+l("width")+"v"+-l("height")+"H-0zM"+g.x+" "+g.y+"h"+g.w+"v"+g.h+"h-"+g.w+"V-"+g.h+"z"),y.up&&y.up(g)}function o(e){e=t(e),g.x=e.x-.5*g.w,g.y=e.y-.5*g.h,n(),i()}function h(e){v||(document.addEventListener("mousemove",d),document.addEventListener("mouseup",r),o(e),v=!0)}function r(e){v&&(document.removeEventListener("mouseup",r),document.removeEventListener("mousemove",d),v=!1)}function d(e){v&&o(e)}function u(e,o,h){function r(e){e.stopPropagation(),s=!0,document.addEventListener("mouseup",u),document.addEventListener("mousemove",d)}function d(e){e.stopPropagation(),s&&(h(t(e)),n(),i())}function u(e){e.stopPropagation(),s=!1,document.removeEventListener("mouseup",u),document.removeEventListener("mousemove",d)}var s=!1;this.el=document.createElement("span"),this.el.className="imgc-handles-el-"+e+"-"+o,this.el.addEventListener("mousedown",r)}var s,a,c,m={update:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],max_width:["mw",500],max_height:["mh",500],fixed_size:["fs",!1]},w=[function(e){w[7](e),w[4](e)},function(e){g.w=e.x-g.x,w[4](e)},function(e){g.w=e.x-g.x,g.h=e.y-g.y},function(e){w[7],g.h=e.y-g.y},function(e){g.h+=g.y-e.y,g.y=e.y},function(e){g.w=e.x-g.x},function(e){g.h=e.y-g.y},function(e){g.w+=g.x-e.x,g.x=e.x}],l=function(e){return s.getBoundingClientRect()[e]},p=null,f=!1,v=!1,g={x:0,y:0,w:80,h:80},y={},x=null,E=function(e){e=e?e:{};for(var t in m)y[m[t][0]]=t in e?e[t]:m[t][1]},L=function(e){s&&this.destroy(),s=document.querySelector(e),s.className+=" imgc ".indexOf(" "+y.cn+" ")>-1?"":" imgc"};return e.prototype.create=function(e){if(!f){s||setParent(e);var t=x.width,n=x.height;t>y.mw&&(n=~~(y.mw*n/t),t=y.mw),n>y.mh&&(t=~~(y.mh*t/n),n=y.mh),w_h_ratio={w:x.naturalWidth/t,h:x.naturalHeight/n},s.style.width=t+"px",s.style.height=n+"px",s.addEventListener("DOMNodeRemovedFromDocument",this.destroy),p=document.createElement("canvas"),p.setAttribute("width",t),p.setAttribute("height",n),s.appendChild(p),s.appendChild(x);var o=document.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("height",n),o.setAttribute("width",t),s.appendChild(o),c=document.createElementNS("http://www.w3.org/2000/svg","path"),c.style.fill="rgba(0, 0, 0, .8)",o.appendChild(c),a=document.createElement("div"),a.className="imgc-handles",s.appendChild(a);for(var r=0;r<(y.fs?4:8);r++){var d=new u(y.fs?0:~~(r/4),r%4,w[r]);a.appendChild(d.el)}s.addEventListener("mousedown",h),f=!0,i(),y.cr&&y.cr(g)}},e.prototype.destroy=function(){if(f){if(s){for(s.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),s.removeEventListener("mousedown",h);s.firstChild;)s.removeChild(s.firstChild);s=p=x=a=c=null}f=!1,y.de&&y.de()}},e.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1),p.setAttribute("width",g.w),p.setAttribute("height",g.h);var n=p.getContext("2d");return n.drawImage(x,w_h_ratio.w*g.x,w_h_ratio.h*g.y,w_h_ratio.w*g.w,w_h_ratio.h*g.h,0,0,g.w,g.h),p.toDataURL(e,t)},e}();
},{}]},{},[1]);
