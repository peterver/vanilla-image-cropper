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
  create_cb: function(dim) {
    console.log('created - ', dim);
  },
  destroy_cb: function() {
    console.log('destroy');
  }
});
is_active = true;
},{"./imagecrop.min.js":2}],2:[function(require,module,exports){
module.exports=function(){function e(e,t,n){t&&e&&(_(n),b(e),L=new Image,L.addEventListener("load",function(e){this.create()}.bind(this)),L.src=t)}function t(e){var t=e.clientX-p("left"),n=e.clientY-p("top");return{x:0>t?0:t>p("width")?p("width"):t,y:0>n?0:n>p("height")?p("height"):n}}function n(){g.w=g.w<32?32:g.w,g.h=g.h<32?32:g.h,g.x=g.x<0?0:g.x+g.w>p("width")?p("width")-g.w:g.x,g.y=g.y<0?0:g.y+g.h>p("height")?p("height")-g.h:g.y}function i(){c.style.top=g.y+"px",c.style.left=g.x+"px",c.style.width=g.w+"px",c.style.height=g.h+"px",m.setAttribute("d","M 0 0 v"+p("height")+"h"+p("width")+"v"+-p("height")+"H-0zM"+g.x+" "+g.y+"h"+g.w+"v"+g.h+"h-"+g.w+"V-"+g.h+"z"),E.up&&E.up(g)}function o(e){e=t(e),g.x=e.x-.5*g.w,g.y=e.y-.5*g.h,n(),i()}function h(e){x||(document.addEventListener("mousemove",d),document.addEventListener("mouseup",r),o(e),x=!0)}function r(e){x&&(document.removeEventListener("mouseup",r),document.removeEventListener("mousemove",d),x=!1)}function d(e){x&&o(e)}function u(e,o,h){function r(e){e.stopPropagation(),s=!0,document.addEventListener("mouseup",u),document.addEventListener("mousemove",d)}function d(e){e.stopPropagation(),s&&(h(t(e)),n(),i())}function u(e){e.stopPropagation(),s=!1,document.removeEventListener("mouseup",u),document.removeEventListener("mousemove",d)}var s=!1,h=h,c=e,a=o;this.el=document.createElement("span"),this.el.className="imgc-handles-el-"+c+"-"+a,this.el.addEventListener("mousedown",r)}var s,c,a,m,w={update:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],max_width:["mw",500],max_height:["mh",500]},l=[function(e){g.w+=g.x-e.x,g.h+=g.y-e.y,g.x=e.x,g.y=e.y},function(e){g.w=e.x-g.x,g.h+=g.y-e.y,g.y=e.y},function(e){g.w=e.x-g.x,g.h=e.y-g.y},function(e){g.w+=g.x-e.x,g.x=e.x,g.h=e.y-g.y},function(e){g.h+=g.y-e.y,g.y=e.y},function(e){g.w=e.x-g.x},function(e){g.h=e.y-g.y},function(e){g.w+=g.x-e.x,g.x=e.x}],p=function(e){return s.getBoundingClientRect()[e]},y=[],v=null,f=!1,x=!1,g={x:0,y:0,w:80,h:80},E={},L=null,_=function(e){e=e?e:{};for(var t in w)E[w[t][0]]=t in e?e[t]:w[t][1]},b=function(e){s&&this.destroy(),s=document.querySelector(e),s.className+=" imgc ".indexOf(" "+E.cn+" ")>-1?"":" imgc"};return e.prototype.create=function(e){if(!f){s||setParent(e);var t=L.width,n=L.height;t>E.mw&&(n=~~(E.mw*n/t),t=E.mw),n>E.mh&&(t=~~(E.mh*t/n),n=E.mh),w_h_ratio={w:L.naturalWidth/t,h:L.naturalHeight/n},s.style.width=t+"px",s.style.height=n+"px",s.addEventListener("DOMNodeRemovedFromDocument",this.destroy),v=document.createElement("canvas"),v.setAttribute("width",t),v.setAttribute("height",n),s.appendChild(v),s.appendChild(L),a=document.createElementNS("http://www.w3.org/2000/svg","svg"),a.setAttribute("height",n),a.setAttribute("width",t),s.appendChild(a),m=document.createElementNS("http://www.w3.org/2000/svg","path"),m.style.fill="rgba(0, 0, 0, .8)",a.appendChild(m),c=document.createElement("div"),c.className="imgc-handles",s.appendChild(c),y=[];for(var o=0;8>o;o++)y.push(new u(~~(o/4),o%4,l[o])),c.appendChild(y[o].el);s.addEventListener("mousedown",h),f=!0,i(),E.cr&&E.cr(g)}},e.prototype.destroy=function(){if(f){if(s){for(s.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),s.removeEventListener("mousedown",h);s.firstChild;)s.removeChild(s.firstChild);s=v=L=c=y=a=m=null}f=!1,E.de&&E.de()}},e.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1),v.setAttribute("width",g.w),v.setAttribute("height",g.h),console.log(L.naturalWidth/g.w);var n=v.getContext("2d");return n.drawImage(L,w_h_ratio.w*g.x,w_h_ratio.h*g.y,w_h_ratio.w*g.w,w_h_ratio.h*g.h,0,0,g.w,g.h),v.toDataURL(e,t)},e}();
},{}]},{},[1]);
