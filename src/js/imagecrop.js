module.exports = (() => {

//
//  VARIABLES
//

        const scope = Object.seal({
            $$initialized : false,
            meta : {
                dimensions : {},
                img : null,
                ratio : {
                    w : 1,
                    h : 1,
                },
            },
            elements : {
                source : null,
                overlay : null,
                handles : null,
            },
            options : {
                update_cb : () => {},
                create_cb : () => {},
                destroy_cb : () => {},
                min_crop_width : 32,
                min_crop_height : 32,
                max_width : 500,
                max_height : 500,
                fixed_size : false,
                mode : 'square',
            },
        });

        //  Callback handlers used for every handle and their cbs
        const handles_cbs = [
            (evt) => {  //  TOP LEFT [0]
                const original_x = scope.meta.dimensions.x;

                handles_cbs[7](evt);
                if (!scope.options.fixed_size) handles_cbs[4](evt);
                else {
                    if (scope.meta.dimensions.y + scope.meta.dimensions.x - original_x < 0) {
                        scope.meta.dimensions.x = original_x - scope.meta.dimensions.y;
                        scope.meta.dimensions.y = 0;
                    } else {
                        scope.meta.dimensions.y += scope.meta.dimensions.x - original_x;
                    }
                }
            },
            (evt) => {  //  TOP RIGHT [1]
                const {x2} = scope.meta.dimensions;

                handles_cbs[5](evt);
                if (!scope.options.fixed_size) handles_cbs[4](evt);
                else {
                    if (scope.meta.dimensions.y - scope.meta.dimensions.x2 + x2 < 0) {
                        scope.meta.dimensions.x2 = x2 + scope.meta.dimensions.y;
                        scope.meta.dimensions.y = 0;
                    } else {
                        scope.meta.dimensions.y -= scope.meta.dimensions.x2 - x2;
                    }
                }
            },
            (evt) => {  //  BOTTOM RIGHT [2]
                const {x2} = scope.meta.dimensions;

                handles_cbs[5](evt);
                if (!scope.options.fixed_size) handles_cbs[6](evt);
                else {
                    const source_dimensions = scope.elements.source.getBoundingClientRect();

                    if (scope.meta.dimensions.y2 + scope.meta.dimensions.x2 - x2 > source_dimensions.height) {
                        scope.meta.dimensions.x2 = x2 + (source_dimensions.height - scope.meta.dimensions.y2);
                        scope.meta.dimensions.y2 = source_dimensions.height;
                    } else {
                        scope.meta.dimensions.y2 += scope.meta.dimensions.x2 - x2;
                    }
                }
            },
            (evt) => {  //  BOTTOM LEFT [3]
                const {x} = scope.meta.dimensions;

                handles_cbs[7](evt);
                if (!scope.options.fixed_size) handles_cbs[6](evt);
                else {
                    const source_dimensions = scope.elements.source.getBoundingClientRect();

                    if (scope.meta.dimensions.y2 + (x - scope.meta.dimensions.x) > source_dimensions.height) {
                        scope.meta.dimensions.x = x - (source_dimensions.height - scope.meta.dimensions.y2);
                        scope.meta.dimensions.y2 = source_dimensions.height;
                    } else {
                        scope.meta.dimensions.y2 -= scope.meta.dimensions.x - x;
                    }
                }
            },
            //  TOP [4]
            (evt) => scope.meta.dimensions.y = (scope.meta.dimensions.y2 - evt.y < scope.options.min_crop_height)
                ? scope.meta.dimensions.y2 - scope.options.min_crop_height
                : evt.y,
            //  RIGHT [5]
            (evt) => scope.meta.dimensions.x2 = (evt.x - scope.meta.dimensions.x < scope.options.min_crop_width)
                ? scope.meta.dimensions.x + scope.options.min_crop_width
                : evt.x,
            //  BOTTOM [6]
            (evt) => scope.meta.dimensions.y2 = (evt.y - scope.meta.dimensions.y < scope.options.min_crop_height)
                ? scope.meta.dimensions.y + scope.options.min_crop_height
                : evt.y,
            //  LEFT [7]
            (evt) => scope.meta.dimensions.x = (scope.meta.dimensions.x2 - evt.x < scope.options.min_crop_width)
                ? scope.meta.dimensions.x2 - scope.options.min_crop_width
                : evt.x,
        ];

//
//  UTILITY / DIMENSIONAL CHECKS
//

        function convertGlobalToLocal (evt) {
            const d = scope.elements.source.getBoundingClientRect();
            const x = evt.clientX - d.left;
            const y = evt.clientY - d.top;

            return {
                x : x < 0 ? 0 : (x > d.width ? d.width : x),    //  Make sure X is always within the bounds of our dimensions
                y : y < 0 ? 0 : (y > d.height ? d.height : y)   //  Make sure Y is always within the bounds of our dimensions
            };
        }

        function cell (tag, cname, attrs, par, is_svg) {
            const el = !is_svg
                ? document.createElement(tag)
                : document.createElementNS('http://www.w3.org/2000/svg', tag);

            if (cname) el.className = cname;
            if (par) par.appendChild(el);

            Object.keys(attrs || {}).forEach((key) => el.setAttribute(key, attrs[key]));
            return el;
        }

        function render () {
            //  Retrieve width/height
            let {width : source_w, height : source_h} = scope.elements.source.style;

            source_w = parseInt(source_w);
            source_h = parseInt(source_h);

            const {dimensions} = scope.meta;

            //  boundary collision check
            if (dimensions.x < 0) {
                dimensions.x = 0;
                dimensions.x2 = dimensions.w;
            }

            if (dimensions.y < 0) {
                dimensions.y = 0;
                dimensions.y2 = dimensions.h;
            }

            if (dimensions.x2 > source_w) {
                dimensions.x2 = source_w;
                dimensions.x = dimensions.x2 - dimensions.w;
            }

            if (dimensions.y2 > source_h) {
                dimensions.y2 = source_h;
                dimensions.y = dimensions.y2 - dimensions.h;
            }

            //  Set w/h for future use
            dimensions.w = dimensions.x2 - dimensions.x;
            dimensions.h = dimensions.y2 - dimensions.y;

            const {x, x2, y, y2, w, h} = dimensions;
            const w_rad = w * 0.5;
            const h_rad = h * 0.5;

            //  Draw
            scope.elements.handles.style.top = `${y}px`;
            scope.elements.handles.style.left = `${x}px`;
            scope.elements.handles.style.right = `${~~(source_w - x2)}px`;
            scope.elements.handles.style.bottom = `${~~(source_h - y2)}px`;

            //  Set path on svg
            scope.elements.overlay.setAttribute('d', `M 0 0 v ${source_h} h ${source_w} v ${-source_h} H-0zM` + ((scope.options.mode === 'square')
                ? `${x} ${y} h ${w} v ${h} h ${-w} V ${-h} z`
                : `${x + w * 0.5} ${y + h * 0.5} m ${-w_rad},0 a ${w_rad}, ${h_rad} 0 1,0 ${w},0 a ${w_rad}, ${h_rad} 0 1,0 ${-w} ,0 z`
            ));

            scope.options.update_cb(dimensions);
        }

        function update (evt) {
            evt = convertGlobalToLocal(evt);
            const {dimensions} = scope.meta;

            dimensions.x = evt.x - dimensions.w * 0.5;
            dimensions.y = evt.y - dimensions.h * 0.5;
            dimensions.x2 = evt.x + dimensions.w * 0.5;
            dimensions.y2 = evt.y + dimensions.h * 0.5;
            render();
        }

        function setParent (selector) {
            if (scope.elements.source) this.destroy();

            scope.elements.source = document.querySelector(selector);

            if (scope.elements.source.className.indexOf('imgc') === -1) scope.elements.source.className += ' imgc';
        }

//
//  EVENTS
//

        function document_mousedown (evt) {
            document.addEventListener('mousemove', document_mousemove);
            document.addEventListener('mouseup', window_blur);
            update(evt);
        }

        function document_mousemove (evt) {
            update(evt);
        }

        function window_blur () {
            document.removeEventListener('mouseup', window_blur);
            document.removeEventListener('mousemove', document_mousemove);
        }

//
//  HANDLE
//

        function Handle (type, direction, cb) {
            function handleDown (evt) {
                evt.stopPropagation();
                document.addEventListener('mouseup', handleUp);
                document.addEventListener('mousemove', handleMove);
            }

            function handleMove (evt) {
                evt.stopPropagation();
                cb(convertGlobalToLocal(evt));
                render();
            }

            function handleUp (evt) {
                evt.stopPropagation();
                document.removeEventListener('mouseup', handleUp);
                document.removeEventListener('mousemove', handleMove);
            }

            const el = cell('span', `imgc-handles-el-${type}-${direction}`);

            el.addEventListener('mousedown', handleDown);
            return el;
        }

//
//  IMAGE CROPPER
//

        function ImageCropper (selector, img_src, opts = {}) {
            if (!img_src || !selector) return;
            //  Parse options
            Object.keys(opts || {}).forEach((key) => scope.options[key] = opts[key]);

            if (scope.options.min_crop_width > 80) {
                scope.meta.dimensions.x2 = scope.meta.dimensions.w = scope.options.min_crop_width;
            }

            if (scope.options.min_crop_height > 80) {
                scope.meta.dimensions.y2 = scope.meta.dimensions.h = scope.options.min_crop_height;
            }

            if (scope.options.fixed_size) {
                if (scope.options.min_crop_width > 80 || scope.options.min_crop_height > 80) {
                    scope.meta.dimensions.x2 = scope.meta.dimensions.y2 = scope.meta.dimensions.w = scope.meta.dimensions.h = (scope.options.min_crop_width > scope.options.min_crop_height)
                        ? scope.options.min_crop_width
                        : scope.options.min_crop_height;
                }
            }

            //  Get parent
            setParent.call(this, selector);
            //  Load image
            scope.meta.img = new Image();
            scope.meta.img.addEventListener('load', () => this.create());
            scope.meta.img.src = img_src;
        }

        ImageCropper.prototype.create = function (selector) {
            if (scope.$$initialized) return;
            if (!scope.elements.source) setParent.call(this, selector);

            //  Calculate width and height based on max-width and max-height
            let {width : img_w, height : img_h} = scope.meta.img;

            if (img_w > scope.options.max_width) {
                img_h = ~~(scope.options.max_width * img_h / img_w);
                img_w = scope.options.max_width;
            }
            if (img_h > scope.options.max_height) {
                img_w = ~~(scope.options.max_height * img_w / img_h);
                img_h = scope.options.max_height;
            }
            //  Set ratio to use in processing afterwards ( this is based on original image size )
            scope.meta.ratio = {
                w : scope.meta.img.naturalWidth / img_w,
                h : scope.meta.img.naturalHeight / img_h,
            };

            scope.elements.source.style.width = `${img_w}px`;
            scope.elements.source.style.height = `${img_h}px`;
            scope.elements.source.addEventListener('DOMNodeRemovedFromDocument', this.destroy);

            //  Image for seeing
            const img_wrap = cell('div', 'imgc-content', {}, scope.elements.source);

            img_wrap.appendChild(scope.meta.img);

            //  Build SVG overlay
            const overlay = cell('svg', null, {
                height : img_h,
                width : img_w
            }, scope.elements.source, true);

            scope.elements.overlay = cell('path', null, {
                'fill-rule' : 'evenodd'
            }, overlay, true);

            //  Build handlers
            scope.elements.handles = cell('div', `imgc-handles imgc-handles-${scope.options.mode}`, {}, scope.elements.source);

            for (let i = 0; i < (scope.options.fixed_size ? 4 : 8); i++) {
                scope.elements.handles.appendChild(new Handle(scope.options.fixed_size ? 0 : ~~(i / 4), i % 4, handles_cbs[i]));
            }

            scope.elements.source.addEventListener('mousedown', document_mousedown);

            scope.$$initialized = true;
            //  Reset dim
            scope.meta.dimensions = {
                x : 0,
                y : 0,
                w : 0,
                h : 0
            };

            if (img_w === img_h) {
                scope.meta.dimensions.x2 = scope.meta.dimensions.y2 = img_w;
            } else if (img_w > img_h) {
                scope.meta.dimensions.x2 = img_h;
                scope.meta.dimensions.y2 = (scope.options.fixed_size) ? img_h : img_h - (img_w - img_h);
            } else if (img_h > img_w) {
                scope.meta.dimensions.x2 = (scope.meta.fixed_size) ? img_w : img_w - (img_h - img_w);
                scope.meta.dimensions.y2 = img_w;
            }

            //  Render
            render();
            scope.options.create_cb({
                w : img_w,
                h : img_h
            });
        };

        ImageCropper.prototype.destroy = () => {
            if (!scope.$$initialized) return;

            if (scope.elements.source) {
                scope.elements.source.removeEventListener('DOMNodeRemovedFromDocument', this);
                scope.elements.source.removeEventListener('mousedown', document_mousedown);

                while (scope.elements.source.firstChild) {
                    scope.elements.source.removeChild(scope.elements.source.firstChild);
                }
                scope.elements.source = scope.meta.img = scope.elements.handles = scope.elements.overlay = null;
            }

            scope.$$initialized = false;

            if (scope.options.destroy_cb) scope.options.destroy_cb();
        };

        ImageCropper.prototype.crop = (mime_type = 'image/jpeg', quality = 1) => {
            mime_type = (['image/jpeg', 'image/png'].indexOf(mime_type) !== -1)
                ? 'image/jpeg'
                : mime_type;

            quality = (quality < 0 || quality > 1)
                ? 1
                : quality;

            const {x, y, w, h} = scope.meta.dimensions;
            const canvas = cell('canvas', null, {
                width : w,
                height : h
            });

            canvas.getContext('2d').drawImage(
                scope.meta.img,
                scope.meta.ratio.w * x,
                scope.meta.ratio.h * y,
                scope.meta.ratio.w * w,
                scope.meta.ratio.h * h,
                0,
                0,
                w,
                h
            );

            return canvas.toDataURL(mime_type, quality);
        };

        return ImageCropper;
})();
