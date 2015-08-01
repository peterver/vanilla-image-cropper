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

  new ImageCropper('.test-imagecrop', 'img.jpg', {
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
  create_cb: function(dim) {
    console.log('created - ', dim);
  },
  destroy_cb: function() {
    console.log('destroy');
  }
});
is_active = true;
},{"./imagecrop.min.js":2}],2:[function(require,module,exports){
module.exports=function(){function e(e,t,n){t&&e&&(b(n),C(e),L=new Image,L.addEventListener("load",function(e){this.create()}.bind(this)),L.src=t)}function t(e){var t=e.clientX-l("left"),n=e.clientY-l("top");return{x:0>t?0:t>l("width")?l("width"):t,y:0>n?0:n>l("height")?l("height"):n}}function n(){f.w=f.w<32?32:f.w,f.h=f.h<32?32:f.h,f.x=f.x<0?0:f.x+f.w>l("width")?l("width")-f.w:f.x,f.y=f.y<0?0:f.y+f.h>l("height")?l("height")-f.h:f.y}function i(){c.style.top=f.y+"px",c.style.left=f.x+"px",c.style.width=f.w+"px",c.style.height=f.h+"px",a.setAttribute("d","M 0 0 v"+l("height")+"h"+l("width")+"v"+-l("height")+"H-0zM"+f.x+" "+f.y+"h"+f.w+"v"+f.h+"h-"+f.w+"V-"+f.h+"z"),E.up&&E.up(f)}function o(e){e=t(e),f.x=e.x-.5*f.w,f.y=e.y-.5*f.h,n(),i()}function h(e){g||(document.addEventListener("mousemove",r),document.addEventListener("mouseup",d),o(e),g=!0)}function d(e){g&&(document.removeEventListener("mouseup",d),document.removeEventListener("mousemove",r),g=!1)}function r(e){g&&o(e)}function u(e,o,h){function d(e){e.stopPropagation(),s=!0,document.addEventListener("mouseup",u),document.addEventListener("mousemove",r)}function r(e){e.stopPropagation(),s&&(h(t(e)),n(),i())}function u(e){e.stopPropagation(),s=!1,document.removeEventListener("mouseup",u),document.removeEventListener("mousemove",r)}var s=!1,h=h,c=e,m=o;this.el=document.createElement("span"),this.el.className="imgc-handles-el-"+c+"-"+m,this.el.addEventListener("mousedown",d)}var s,c,m,a,w={update:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],max_width:["mw",500],max_height:["mh",500]},p=[function(e){f.w+=f.x-e.x,f.h+=f.y-e.y,f.x=e.x,f.y=e.y},function(e){f.w=e.x-f.x,f.h+=f.y-e.y,f.y=e.y},function(e){f.w=e.x-f.x,f.h=e.y-f.y},function(e){f.w+=f.x-e.x,f.x=e.x,f.h=e.y-f.y},function(e){f.h+=f.y-e.y,f.y=e.y},function(e){f.w=e.x-f.x},function(e){f.h=e.y-f.y},function(e){f.w+=f.x-e.x,f.x=e.x}],l=function(e){return s.getBoundingClientRect()[e]},y=[],v=null,x=!1,g=!1,f={x:0,y:0,w:80,h:80},E={},L=null,b=function(e){e=e?e:{};for(var t in w)E[w[t][0]]=t in e?e[t]:w[t][1]},C=function(e){s&&this.destroy(),s=document.querySelector(e),s.className+=" imgc ".indexOf(" "+E.cn+" ")>-1?"":" imgc"};return e.prototype.create=function(e){if(!x){s||setParent(e);var t=L.width,n=L.height;t>E.mw&&(n=~~(E.mw*n/t),t=E.mw),n>E.mh&&(t=~~(E.mh*t/n),n=E.mh),s.style.width=t+"px",s.style.height=n+"px",s.addEventListener("DOMNodeRemovedFromDocument",this.destroy),v=document.createElement("canvas"),v.setAttribute("width",t),v.setAttribute("height",n),s.appendChild(v),s.appendChild(L),L.width=t,L.height=n,m=document.createElementNS("http://www.w3.org/2000/svg","svg"),m.setAttribute("height",l("height")),m.setAttribute("width",l("width")),s.appendChild(m),a=document.createElementNS("http://www.w3.org/2000/svg","path"),a.style.fill="rgba(0, 0, 0, .8)",m.appendChild(a),c=document.createElement("div"),c.className="imgc-handles",s.appendChild(c),y=[];for(var o=0;8>o;o++)y.push(new u(~~(o/4),o%4,p[o])),c.appendChild(y[o].el);s.addEventListener("mousedown",h),x=!0,i(),E.cr&&E.cr(f)}},e.prototype.destroy=function(){if(x){if(s){for(s.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),s.removeEventListener("mousedown",h);s.firstChild;)s.removeChild(s.firstChild);s=v=L=c=y=m=a=null}x=!1,E.de&&E.de()}},e.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1);var n={x:f.x,y:f.y,w:f.w,h:f.h};v.setAttribute("width",n.w),v.setAttribute("height",n.h);var i=v.getContext("2d");return i.imageSmoothingEnabled=!1,i.drawImage(L,n.x,n.y,n.w,n.h,0,0,n.w,n.h),v.toDataURL(e,t)},e}();
},{}]},{},[1]);
