import {cell} from '../../utils/Dom';
import {convertGlobalToLocal} from '../../utils/Event';

//
//  CALLBACKS FOR EACH TYPE OF HANDLE
//

    const HANDLES = Object.freeze([
        (pos, dim, opts) => { //  TOP LEFT
            const {x} = dim;

            HANDLES[7](pos, dim, opts);

            if (!opts.fixed_size) HANDLES[4](pos, dim, opts);
            else {
                if (dim.y + dim.x - x < 0) {
                    dim.x = x - dim.y;
                    dim.y = 0;
                } else {
                    dim.y += dim.x - x;
                }
            }
        },
        (pos, dim, opts) => { //  TOP RIGHT
            const {x2} = dim;

            HANDLES[5](pos, dim, opts);

            if (!opts.fixed_size) HANDLES[4](pos, dim, opts);
            else {
                if (dim.y - dim.x2 + x2 < 0) {
                    dim.x2 = x2 + dim.y;
                    dim.y = 0;
                } else {
                    dim.y -= dim.x2 - x2;
                }
            }
        },
        (pos, dim, opts) => { //  BOTTOM RIGHT
            const {x2} = dim;

            HANDLES[5](pos, dim, opts);

            if (!opts.fixed_size) HANDLES[6](pos, dim, opts);
            else {
                if (dim.y2 + dim.x2 - x2 > dim.h) {
                    dim.x2 = x2 + (dim.h - dim.y2);
                    dim.y2 = dim.h;
                } else {
                    dim.y2 += dim.x2 - x2;
                }
            }
        },
        (pos, dim, opts) => { //  BOTTOM LEFT
            const {x} = dim;

            HANDLES[7](pos, dim, opts);

            if (!opts.fixed_size) HANDLES[6](pos, dim, opts);
            else {
                if (dim.y2 + (x - dim.x) > dim.h) {
                    dim.x = x - (dim.h - dim.y2);
                    dim.y2 = dim.h;
                } else {
                    dim.y2 -= dim.x - x;
                }
            }
        },
        //  TOP
        (pos, dim, opts) => dim.y = (dim.y2 - pos.y < opts.min_crop_height)
            ? dim.y2 - opts.min_crop_height
            : pos.y,
        //  RIGHT
        (pos, dim, opts) => dim.x2 = (pos.x - dim.x < opts.min_crop_width)
            ? dim.x + opts.min_crop_width
            : pos.x,
        //  BOTTOM
        (pos, dim, opts) => dim.y2 = (pos.y - dim.y < opts.min_crop_height)
            ? dim.y + opts.min_crop_height
            : pos.y,
        //  LEFT
        (pos, dim, opts) => dim.x = (dim.x2 - pos.x < opts.min_crop_width)
            ? dim.x2 - opts.min_crop_width
            : pos.x,
    ]);

//
//  PUBLIC
//

    export default class Handle {
        constructor (parent, type, scope) {
            this.$$view = cell('span', ['imgc-handles-el', `imgc-handles-el-${~~(type / 4)}-${type % 4}`], {}, parent);

            //  Down handler
            function handleMouseDown (evt) {
                evt.stopPropagation();

                document.addEventListener('mouseup', handleMouseUp);
                document.addEventListener('mousemove', handleMouseMove);
            }

            //  Up handler
            function handleMouseUp (evt) {
                evt.stopPropagation();

                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('mousemove', handleMouseMove);
            }

            //  Move handler
            function handleMouseMove (evt) {
                evt.stopPropagation();

                HANDLES[type](
                    convertGlobalToLocal(evt, scope.$$parent.getBoundingClientRect()),
                    scope.meta.dimensions,
                    scope.options
                );

                parent.dispatchEvent(new CustomEvent('source:dimensions'));
            }

            //  Bootstrap element
            this.$$view.addEventListener('mousedown', handleMouseDown);
        }
    }
