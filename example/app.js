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
  min_crop_width: 100,
  min_crop_height: 150,
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
module.exports=function(){function e(e,t,n){if(t&&e){n=n?n:{};for(var i in u)w[u[i][0]]=i in n?n[i]:u[i][1];w.mcw>80&&(x.x2=x.w=w.mcw),w.mch>80&&(x.y2=x.h=w.mch),w.fs&&(w.mcw>80||w.mch>80)&&(x.x2=x.y2=x.w=x.h=w.mcw>w.mch?w.mcw:w.mch),f(e),p=new Image,p.addEventListener("load",function(e){this.create()}.bind(this)),p.src=t}}function t(e){var t=m.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top;return{x:0>n?0:n>t.width?t.width:n,y:0>i?0:i>t.height?t.height:i}}function n(){var e=parseInt(m.style.width),t=parseInt(m.style.height);x.x<0&&(x.x=0,x.x2=x.w),x.y<0&&(x.y=0,x.y2=x.h),x.x2>e&&(x.x2=e,x.x=x.x2-x.w),x.y2>t&&(x.y2=t,x.y=x.y2-x.h),x.w=x.x2-x.x,x.h=x.y2-x.y,d.style.top=x.y+"px",d.style.left=x.x+"px",d.style.right=~~(e-x.x2)+"px",d.style.bottom=~~(t-x.y2)+"px",s.setAttribute("d","M 0 0 v"+t+"h"+e+"v"+-t+"H-0zM"+x.x+" "+x.y+"h"+x.w+"v"+x.h+"h-"+x.w+"V-"+x.h+"z"),w.up&&w.up(x)}function i(e){e=t(e),x.x=e.x-.5*x.w,x.y=e.y-.5*x.h,x.x2=e.x+.5*x.w,x.y2=e.y+.5*x.h,n()}function o(e){document.addEventListener("mousemove",r),document.addEventListener("mouseup",h),i(e)}function h(e){document.removeEventListener("mouseup",h),document.removeEventListener("mousemove",r)}function r(e){i(e)}function c(e,i,o){function h(e){e.stopPropagation(),document.addEventListener("mouseup",c),document.addEventListener("mousemove",r)}function r(e){e.stopPropagation(),e=t(e),o(e),n()}function c(e){e.stopPropagation(),document.removeEventListener("mouseup",c),document.removeEventListener("mousemove",r)}var m=document.createElement("span");return m.className="imgc-handles-el-"+e+"-"+i,m.addEventListener("mousedown",h),m}var m,d,s,u={update:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],min_crop_width:["mcw",32],min_crop_height:["mch",32],max_width:["mw",500],max_height:["mh",500],fixed_size:["fs",!1]},a=[function(e){var t=x.x;a[7](e),w.fs?x.y+x.x-t<0?(x.x=t-x.y,x.y=0):x.y+=x.x-t:a[4](e)},function(e){var t=x.x2;a[5](e),w.fs?x.y-x.x2+t<0?(x.x2=t+x.y,x.y=0):x.y-=x.x2-t:a[4](e)},function(e){var t=x.x2;if(a[5](e),w.fs){var n=m.getBoundingClientRect();x.y2+x.x2-t>n.height?(x.x2=t+(n.height-x.y2),x.y2=n.height):x.y2+=x.x2-t}else a[6](e)},function(e){var t=x.x;if(a[7](e),w.fs){var n=m.getBoundingClientRect();x.y2+(t-x.x)>n.height?(x.x=t-(n.height-x.y2),x.y2=n.height):x.y2-=x.x-t}else a[6](e)},function(e){x.y=x.y2-e.y<w.mch?x.y2-w.mch:e.y},function(e){x.x2=e.x-x.x<w.mcw?x.x+w.mcw:e.x},function(e){x.y2=e.y-x.y<w.mch?x.y+w.mch:e.y},function(e){x.x=x.x2-e.x<w.mcw?x.x2-w.mcw:e.x}],y=!1,x={},w={},p=null,v={w:1,h:1},f=function(e){m&&this.destroy(),m=document.querySelector(e),m.className+=" imgc ".indexOf(" "+w.cn+" ")>-1?"":" imgc"};return e.prototype.create=function(e){if(!y){m||f(e);var t=p.width,i=p.height;t>w.mw&&(i=~~(w.mw*i/t),t=w.mw),i>w.mh&&(t=~~(w.mh*t/i),i=w.mh),v={w:p.naturalWidth/t,h:p.naturalHeight/i},m.style.width=t+"px",m.style.height=i+"px",m.addEventListener("DOMNodeRemovedFromDocument",this.destroy),m.appendChild(p);var h=document.createElementNS("http://www.w3.org/2000/svg","svg");h.setAttribute("height",i),h.setAttribute("width",t),m.appendChild(h),s=document.createElementNS("http://www.w3.org/2000/svg","path"),h.appendChild(s),d=document.createElement("div"),d.className="imgc-handles",m.appendChild(d);for(var r=0;r<(w.fs?4:8);r++)d.appendChild(new c(w.fs?0:~~(r/4),r%4,a[r]));m.addEventListener("mousedown",o),y=!0,x={x:0,y:0,x2:0,y2:0,w:0,h:0},t===i?x.x2=x.y2=t:t>i?(x.x2=i,x.y2=w.fs?i:i-(t-i)):i>t&&(x.x2=w.fs?t:t-(i-t),x.y2=t),n(),w.cr&&w.cr({w:t,h:i})}},e.prototype.destroy=function(){if(y){if(m){for(m.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),m.removeEventListener("mousedown",o);m.firstChild;)m.removeChild(m.firstChild);m=p=d=s=null}y=!1,w.de&&w.de()}},e.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1);var n=document.createElement("canvas");n.setAttribute("width",x.w),n.setAttribute("height",x.h);var i=n.getContext("2d");return i.drawImage(p,v.w*x.x,v.h*x.y,v.w*x.w,v.h*x.h,0,0,x.w,x.h),n.toDataURL(e,t)},e}();
},{}]},{},[1]);
