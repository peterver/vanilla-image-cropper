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
    update_cb: onUpdateHandler
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
  min_crop_width: 100,
  min_crop_height: 150,
  mode: 'circular',
  fixed_size: false,
  update_cb: onUpdateHandler,
  create_cb: function(dim) {
    console.log('created - ', dim);
  },
  destroy_cb: function() {
    console.log('destroy');
  }
});
is_active = true;
},{"./imagecrop.min.js":2}],2:[function(require,module,exports){
module.exports=function(){function e(e){var t=s.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top;return{x:0>n?0:n>t.width?t.width:n,y:0>i?0:i>t.height?t.height:i}}function t(){var e=parseInt(s.style.width),t=parseInt(s.style.height);y.x<0&&(y.x=0,y.x2=y.w),y.y<0&&(y.y=0,y.y2=y.h),y.x2>e&&(y.x2=e,y.x=y.x2-y.w),y.y2>t&&(y.y2=t,y.y=y.y2-y.h),y.w=y.x2-y.x,y.h=y.y2-y.y,d.style.top=y.y+"px",d.style.left=y.x+"px",d.style.right=~~(e-y.x2)+"px",d.style.bottom=~~(t-y.y2)+"px";var n=["M 0 0 v",t,"h",e,"v",-t,"H-0zM"].join("");if("square"===x.mo)n+=[y.x,y.y,"h",y.w,"v",y.h,"h",-y.w,"V",-y.h,"z"].join(" ");else if("circular"===x.mo){var i=.5*y.w,o=.5*y.h;n+=[y.x+.5*y.w,y.y+.5*y.h,"m",-i,",0","a",i,",",o,"0 1,0",y.w,",0","a",i,",",o,"0 1,0",-y.w,",0","z"].join(" ")}a.setAttribute("d",n),x.up&&x.up(y)}function n(n){n=e(n),y.x=n.x-.5*y.w,y.y=n.y-.5*y.h,y.x2=n.x+.5*y.w,y.y2=n.y+.5*y.h,t()}function i(e){s&&this.destroy(),s=document.querySelector(e),s.className+=s.className.indexOf("imgc")>-1?"":" imgc"}function o(e){document.addEventListener("mousemove",r),document.addEventListener("mouseup",c),n(e)}function c(e){document.removeEventListener("mouseup",c),document.removeEventListener("mousemove",r)}function r(e){n(e)}function h(n,i,o){function c(e){e.stopPropagation(),document.addEventListener("mouseup",h),document.addEventListener("mousemove",r)}function r(n){n.stopPropagation(),n=e(n),o(n),t()}function h(e){e.stopPropagation(),document.removeEventListener("mouseup",h),document.removeEventListener("mousemove",r)}var m=document.createElement("span");return m.className="imgc-handles-el-"+n+"-"+i,m.addEventListener("mousedown",c),m}function m(e,t,n){t&&e&&(n=n||{},Object.keys(f).forEach(function(e){x[f[e][0]]=n[e]||f[e][1]}),x.mcw>80&&(y.x2=y.w=x.mcw),x.mch>80&&(y.y2=y.h=x.mch),x.fs&&(x.mcw>80||x.mch>80)&&(y.x2=y.y2=y.w=y.h=x.mcw>x.mch?x.mcw:x.mch),i.call(this,e),w=new Image,w.addEventListener("load",function(e){this.create()}.bind(this)),w.src=t)}var s,d,a,u=!1,y={},x={},w=null,l={w:1,h:1},f={update_cb:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],min_crop_width:["mcw",32],min_crop_height:["mch",32],max_width:["mw",500],max_height:["mh",500],fixed_size:["fs",!1],mode:["mo","square"]},v=[function(e){var t=y.x;v[7](e),x.fs?y.y+y.x-t<0?(y.x=t-y.y,y.y=0):y.y+=y.x-t:v[4](e)},function(e){var t=y.x2;v[5](e),x.fs?y.y-y.x2+t<0?(y.x2=t+y.y,y.y=0):y.y-=y.x2-t:v[4](e)},function(e){var t=y.x2;if(v[5](e),x.fs){var n=s.getBoundingClientRect();y.y2+y.x2-t>n.height?(y.x2=t+(n.height-y.y2),y.y2=n.height):y.y2+=y.x2-t}else v[6](e)},function(e){var t=y.x;if(v[7](e),x.fs){var n=s.getBoundingClientRect();y.y2+(t-y.x)>n.height?(y.x=t-(n.height-y.y2),y.y2=n.height):y.y2-=y.x-t}else v[6](e)},function(e){y.y=y.y2-e.y<x.mch?y.y2-x.mch:e.y},function(e){y.x2=e.x-y.x<x.mcw?y.x+x.mcw:e.x},function(e){y.y2=e.y-y.y<x.mch?y.y+x.mch:e.y},function(e){y.x=y.x2-e.x<x.mcw?y.x2-x.mcw:e.x}];return m.prototype.create=function(e){if(!u){s||i.call(this,e);var n=w.width,c=w.height;n>x.mw&&(c=~~(x.mw*c/n),n=x.mw),c>x.mh&&(n=~~(x.mh*n/c),c=x.mh),l={w:w.naturalWidth/n,h:w.naturalHeight/c},s.style.width=n+"px",s.style.height=c+"px",s.addEventListener("DOMNodeRemovedFromDocument",this.destroy),s.appendChild(w);var r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("height",c),r.setAttribute("width",n),s.appendChild(r),a=document.createElementNS("http://www.w3.org/2000/svg","path"),a.setAttribute("fill-rule","evenodd"),r.appendChild(a),d=document.createElement("div"),d.className=["imgc-handles",x.mo].join(" "),s.appendChild(d);for(var m=0;m<(x.fs?4:8);m++)d.appendChild(new h(x.fs?0:~~(m/4),m%4,v[m]));s.addEventListener("mousedown",o),u=!0,y={x:0,y:0,x2:0,y2:0,w:0,h:0},n===c?y.x2=y.y2=n:n>c?(y.x2=c,y.y2=x.fs?c:c-(n-c)):c>n&&(y.x2=x.fs?n:n-(c-n),y.y2=n),t(),x.cr&&x.cr({w:n,h:c})}},m.prototype.destroy=function(){if(u){if(s){for(s.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),s.removeEventListener("mousedown",o);s.firstChild;)s.removeChild(s.firstChild);s=w=d=a=null}u=!1,x.de&&x.de()}},m.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1);var n=document.createElement("canvas");n.setAttribute("width",y.w),n.setAttribute("height",y.h);var i=n.getContext("2d");return i.drawImage(w,l.w*y.x,l.h*y.y,l.w*y.w,l.h*y.h,0,0,y.w,y.h),n.toDataURL(e,t)},m}();
},{}]},{},[1]);
