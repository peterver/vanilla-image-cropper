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
  // fixed_size: true,
  create_cb: function(dim) {
    console.log('created - ', dim);
  },
  destroy_cb: function() {
    console.log('destroy');
  }
});
is_active = true;
},{"./imagecrop.min.js":2}],2:[function(require,module,exports){
module.exports=function(){function e(e,t,n){if(t&&e){n=n?n:{};for(var i in m)v[m[i][0]]=i in n?n[i]:m[i][1];y(e),f=new Image,f.addEventListener("load",function(e){this.create()}.bind(this)),f.src=t}}function t(e){var t=u.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top;return{x:0>n?0:n>t.width?t.width:n,y:0>i?0:i>t.height?t.height:i}}function n(){var e=u.getBoundingClientRect();v.fs&&(l.w=l.h),l.w=l.w<32?32:l.w,l.h=l.h<32?32:l.h,l.x=l.x<0?0:l.x+l.w>e.width?e.width-l.w:l.x,l.y=l.y<0?0:l.y+l.h>e.height?e.height-l.h:l.y,s.style.top=l.y+"px",s.style.left=l.x+"px",s.style.width=l.w+"px",s.style.height=l.h+"px",c.setAttribute("d","M 0 0 v"+e.height+"h"+e.width+"v"+-e.height+"H-0zM"+l.x+" "+l.y+"h"+l.w+"v"+l.h+"h-"+l.w+"V-"+l.h+"z"),v.up&&v.up(l)}function i(e){e=t(e),l.x=e.x-.5*l.w,l.y=e.y-.5*l.h,n()}function o(e){document.addEventListener("mousemove",d),document.addEventListener("mouseup",h),i(e)}function h(e){document.removeEventListener("mouseup",h),document.removeEventListener("mousemove",d)}function d(e){i(e)}function r(e,i,o){function h(e){e.stopPropagation(),document.addEventListener("mouseup",r),document.addEventListener("mousemove",d)}function d(e){e.stopPropagation(),o(t(e)),n()}function r(e){e.stopPropagation(),document.removeEventListener("mouseup",r),document.removeEventListener("mousemove",d)}var u=document.createElement("span");return u.className="imgc-handles-el-"+e+"-"+i,u.addEventListener("mousedown",h),u}var u,s,c,m={update:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],max_width:["mw",500],max_height:["mh",500],fixed_size:["fs",!1]},a=[function(e){a[7](e),a[4](e)},function(e){l.w=e.x-l.x,a[4](e)},function(e){l.w=e.x-l.x,l.h=e.y-l.y},function(e){a[7],l.h=e.y-l.y},function(e){l.h+=l.y-e.y,l.y=e.y},function(e){l.w=e.x-l.x},function(e){l.h=e.y-l.y},function(e){l.w+=l.x-e.x,l.x=e.x}],w=null,p=!1,l={x:0,y:0,w:80,h:80},v={},f=null,g={w:1,h:1},y=function(e){u&&this.destroy(),u=document.querySelector(e),u.className+=" imgc ".indexOf(" "+v.cn+" ")>-1?"":" imgc"};return e.prototype.create=function(e){if(!p){u||y(e);var t=f.width,i=f.height;t>v.mw&&(i=~~(v.mw*i/t),t=v.mw),i>v.mh&&(t=~~(v.mh*t/i),i=v.mh),g={w:f.naturalWidth/t,h:f.naturalHeight/i},u.style.width=t+"px",u.style.height=i+"px",u.addEventListener("DOMNodeRemovedFromDocument",this.destroy),w=document.createElement("canvas"),w.setAttribute("width",t),w.setAttribute("height",i),u.appendChild(w),u.appendChild(f);var h=document.createElementNS("http://www.w3.org/2000/svg","svg");h.setAttribute("height",i),h.setAttribute("width",t),u.appendChild(h),c=document.createElementNS("http://www.w3.org/2000/svg","path"),c.style.fill="rgba(0, 0, 0, .8)",h.appendChild(c),s=document.createElement("div"),s.className="imgc-handles",u.appendChild(s);for(var d=0;d<(v.fs?4:8);d++)s.appendChild(new r(v.fs?0:~~(d/4),d%4,a[d]));u.addEventListener("mousedown",o),p=!0,n(),v.cr&&v.cr({w:t,h:i})}},e.prototype.destroy=function(){if(p){if(u){for(u.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),u.removeEventListener("mousedown",o);u.firstChild;)u.removeChild(u.firstChild);u=w=f=s=c=null}p=!1,v.de&&v.de()}},e.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1),w.setAttribute("width",l.w),w.setAttribute("height",l.h);var n=w.getContext("2d");return n.drawImage(f,g.w*l.x,g.h*l.y,g.w*l.w,g.h*l.h,0,0,l.w,l.h),w.toDataURL(e,t)},e}();
},{}]},{},[1]);
