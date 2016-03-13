module.exports = (
    function () {

//
//  VARIABLES
//

        var src_el;

        var handles_wrap;
        var overlay_el;

        var initialized = false;
        var dim = {};
        var opts = {};
        var img = null;
        var ratio = {
            w : 1,
            h : 1
        };

        //  Used to setup the options for the ImageCropper
        var pos_opts = {
            update : ['up', false],
            create_cb : ['cr', false],
            destroy_cb : ['de', false],
            min_crop_width : ['mcw', 32],
            min_crop_height : ['mch', 32],
            max_width : ['mw', 500],
            max_height : ['mh', 500],
            fixed_size : ['fs', false]
        };

        //  Callback handlers used for every handle and their cbs
        var handles_cbs = [
            function (e) {  //  TOP LEFT [0]
                var orig = dim.x;
                handles_cbs[7](e);
                if (!opts.fs) {
                    handles_cbs[4](e);
                } else {
                    if (dim.y + dim.x - orig < 0) {
                        dim.x = orig - dim.y;
                        dim.y = 0;
                    } else {
                        dim.y += dim.x - orig;
                    }
                }
            },
            function (e) {  //  TOP RIGHT [1]
                var orig = dim.x2;
                handles_cbs[5](e);
                if (!opts.fs) {
                    handles_cbs[4](e);
                } else {
                    if (dim.y - dim.x2 + orig < 0) {
                        dim.x2 = orig + dim.y;
                        dim.y = 0;
                    } else {
                        dim.y -= dim.x2 - orig;
                    }
                }
            },
            function (e) {  //  BOTTOM RIGHT [2]
                var orig = dim.x2;
                handles_cbs[5](e);
                if (!opts.fs) {
                    handles_cbs[6](e);
                } else {
                    var src_dim = src_el.getBoundingClientRect();
                    if (dim.y2 + dim.x2 - orig > src_dim.height) {
                        dim.x2 = orig + (src_dim.height - dim.y2);
                        dim.y2 = src_dim.height;
                    } else {
                        dim.y2 += dim.x2 - orig;
                    }
                }
            },
            function (e) {  //  BOTTOM LEFT [3]
                var orig = dim.x;
                handles_cbs[7](e);
                if (!opts.fs) {
                    handles_cbs[6](e);
                } else {
                    var src_dim = src_el.getBoundingClientRect();
                    if (dim.y2 + (orig - dim.x) > src_dim.height) {
                        dim.x = orig - (src_dim.height - dim.y2);
                        dim.y2 = src_dim.height;
                    } else {
                        dim.y2 -= dim.x - orig;
                    }
                }
            },
            function (e) {  //  TOP [4]
                dim.y = ((dim.y2 - e.y < opts.mch)
                    ? dim.y2 - opts.mch
                    : e.y
                );  //  we need to do additional checks based on minimum crop height
            },
            function (e) {  //  RIGHT [5]
                dim.x2 = ((e.x - dim.x < opts.mcw)
                    ? dim.x + opts.mcw
                    : e.x
                );  //  we need to do additional checks based on minimum crop width
            },
            function (e) {  //  BOTTOM [6]
                dim.y2 = ((e.y - dim.y < opts.mch)
                    ? dim.y + opts.mch
                    : e.y
                );  //  we need to do additional checks based on minimum crop height
            },
            function (e) {  //  LEFT [7]
                dim.x = ((dim.x2 - e.x < opts.mcw)
                    ? dim.x2 - opts.mcw
                    : e.x
                );  //  we need to do additional checks based on minimum crop width
            }
        ];

//
//  UTILITY / DIMENSIONAL CHECKS
//

        function setParent (selector) {
            if (src_el) { this.destroy(); }
            src_el = document.querySelector(selector);
            src_el.className += (' imgc ').indexOf(' ' + opts.cn + ' ') > -1
                ? ''
                : ' imgc'
            ;
        }

        function convertGlobalToLocal (e) {
            var d = src_el.getBoundingClientRect();
            var x = e.clientX - d.left;
            var y = e.clientY - d.top;
            return {
                x : x < 0 ? 0 : (x > d.width ? d.width : x),
                y : y < 0 ? 0 : (y > d.height ? d.height : y)
            };
        }

        function render () {
            //  Retrieve width/height
            var w = parseInt(src_el.style.width);
            var h = parseInt(src_el.style.height);

            //  boundary collision check
            if (dim.x < 0) {
                dim.x = 0;
                dim.x2 = dim.w;
            }
            if (dim.y < 0) {
                dim.y = 0;
                dim.y2 = dim.h;
            }
            if (dim.x2 > w) {
                dim.x2 = w;
                dim.x = dim.x2 - dim.w;
            }
            if (dim.y2 > h) {
                dim.y2 = h;
                dim.y = dim.y2 - dim.h;
            }
            //  Set w/h for future use
            dim.w = dim.x2 - dim.x;
            dim.h = dim.y2 - dim.y;

            //  Draw
            handles_wrap.style.top = dim.y + 'px';
            handles_wrap.style.left = dim.x + 'px';
            handles_wrap.style.right = ~~(w - dim.x2) + 'px';
            handles_wrap.style.bottom = ~~(h - dim.y2) + 'px';

            overlay_el.setAttribute('d', 'M 0 0 v' + h + 'h' + w + 'v' + -h + 'H-0zM' + dim.x + ' ' + dim.y + 'h' + dim.w + 'v' + dim.h + 'h-' + dim.w + 'V-' + dim.h + 'z');

            if (opts.up) { opts.up(dim); }
        }

        function update (e) {
            e = convertGlobalToLocal(e);
            dim.x = e.x - dim.w * 0.5;
            dim.y = e.y - dim.h * 0.5;
            dim.x2 = e.x + dim.w * 0.5;
            dim.y2 = e.y + dim.h * 0.5;
            render();
        }

//
//  EVENTS
//

        function document_mousedown (e) {
            document.addEventListener('mousemove', document_mousemove);
            document.addEventListener('mouseup', window_blur);
            update(e);
        }

        function window_blur (e) {
            document.removeEventListener('mouseup', window_blur);
            document.removeEventListener('mousemove', document_mousemove);
        }

        function document_mousemove (e) {
            update(e);
        }

//
//  HANDLE
//

        function Handle (t, i, cb) {
            function handle_down (e) {
                e.stopPropagation();
                document.addEventListener('mouseup', handle_up);
                document.addEventListener('mousemove', handle_move);
            }

            function handle_move (e) {
                e.stopPropagation();
                e = convertGlobalToLocal(e);
                cb(e);
                render();
            }

            function handle_up (e) {
                e.stopPropagation();
                document.removeEventListener('mouseup', handle_up);
                document.removeEventListener('mousemove', handle_move);
            }

            var el = document.createElement('span');
            el.className = 'imgc-handles-el-' + t + '-' + i;
            el.addEventListener('mousedown', handle_down);
            return el;
        }

//
//  IMAGE CROPPER
//

        function ImageCropper (selector, img_src, tmp_opts) {
            if (!img_src || !selector) { return; }
            //  Parse options
            tmp_opts = tmp_opts || {};
            Object.keys(pos_opts).forEach(
                function (key) {
                    opts[pos_opts[key][0]] = tmp_opts[key] || pos_opts[key][1];
                }
            );
            if (opts.mcw > 80) { dim.x2 = dim.w = opts.mcw; }
            if (opts.mch > 80) { dim.y2 = dim.h = opts.mch; }
            if (opts.fs) {
                if (opts.mcw > 80 || opts.mch > 80) {
                    dim.x2 = dim.y2 = dim.w = dim.h = ((opts.mcw > opts.mch)
                        ? opts.mcw
                        : opts.mch
                    );
                }
            }
            //  Get parent
            setParent(selector);
            //  Load image
            img = new Image();
            img.addEventListener('load', function (evt) {
                this.create();
            }.bind(this));
            img.src = img_src;
        }

        ImageCropper.prototype.create = function (selector) {
            if (initialized) { return; }
            if (!src_el) { setParent(selector); }

            //  Calculate width and height based on max-width and max-height
            var w = img.width;
            var h = img.height;

            if (w > opts.mw) {
                h = ~~(opts.mw * h / w);
                w = opts.mw;
            }
            if (h > opts.mh) {
                w = ~~(opts.mh * w / h);
                h = opts.mh;
            }
            //  Set ratio to use in processing afterwards ( this is based on original image size )
            ratio = {
                w : img.naturalWidth / w,
                h : img.naturalHeight / h
            };

            src_el.style.width = w + 'px';
            src_el.style.height = h + 'px';
            src_el.addEventListener('DOMNodeRemovedFromDocument', this.destroy);

            //  Image for seeing
            src_el.appendChild(img);

            //  Build SVG overlay
            var overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            overlay.setAttribute('height', h);
            overlay.setAttribute('width', w);
            src_el.appendChild(overlay);

            overlay_el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            overlay.appendChild(overlay_el);

            //  Build handlers
            handles_wrap = document.createElement('div');
            handles_wrap.className = 'imgc-handles';
            src_el.appendChild(handles_wrap);

            for (var i = 0; i < (opts.fs ? 4 : 8); i++) {
                handles_wrap.appendChild(new Handle(opts.fs ? 0 : ~~(i / 4), i % 4, handles_cbs[i]));
            }

            src_el.addEventListener('mousedown', document_mousedown);

            initialized = true;
            //  Reset dim
            dim = {
                x : 0,
                y : 0,
                x2 : 0,
                y2 : 0,
                w : 0,
                h : 0
            };
            if (w === h) {
                dim.x2 = dim.y2 = w;
            } else if (w > h) {
                dim.x2 = h;
                dim.y2 = (opts.fs) ? h : h - (w - h);
            } else if (h > w) {
                dim.x2 = (opts.fs) ? w : w - (h - w);
                dim.y2 = w;
            }

            //  Render
            render();
            if (opts.cr) {
                opts.cr({
                    w : w,
                    h : h
                });
            }
        };

        ImageCropper.prototype.destroy = function () {
            if (!initialized) { return; }

            if (src_el) {
                src_el.removeEventListener('DOMNodeRemovedFromDocument', this.destroy);
                src_el.removeEventListener('mousedown', document_mousedown);

                while (src_el.firstChild) {
                    src_el.removeChild(src_el.firstChild);
                }
                src_el = img = handles_wrap = overlay_el = null;
            }

            initialized = false;
            if (opts.de) {
                opts.de();
            }
        };

        ImageCropper.prototype.crop = function (mime_type, quality) {
            if (!mime_type || (mime_type !== 'image/jpeg' && mime_type !== 'image/png')) {
                mime_type = 'image/jpeg';
            }
            if (!quality || quality < 0 || quality > 1) {quality = 1;}

            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', dim.w);
            canvas.setAttribute('height', dim.h);

            var ctx = canvas.getContext('2d');
            ctx.drawImage(
                img,
                ratio.w * dim.x,
                ratio.h * dim.y,
                ratio.w * dim.w,
                ratio.h * dim.h,
                0,
                0,
                dim.w,
                dim.h
            );
            return canvas.toDataURL(mime_type, quality);
        };

        return ImageCropper;
    }
)();
