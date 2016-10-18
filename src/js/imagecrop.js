import Content from './components/Content';
import Handles from './components/handles/index';
import Overlay from './components/Overlay';

import {hasValue} from './utils/Object';
import {cell, isElement} from './utils/Dom';
import {MODES, STATES} from './constants';

let el_content = null;
let el_overlay = null;
let el_handles = null;

const scope = Object.seal({
    $$parent : null,
    $$state : STATES.OFFLINE,
    meta : {
        dimensions : {
            x : 0,
            x2 : 0,
            y : 0,
            y2 : 0,
            w : 0,
            h : 0,
        },
        ratio : {
            w : 1,
            h : 1,
        },
    },
    options : {
        update_cb : () => {},
        create_cb : () => {},
        destroy_cb : () => {},
        min_crop_width : 100,
        min_crop_height : 100,
        max_width : 500,
        max_height : 500,
        fixed_size : false,
        mode : MODES.SQUARE,
    },
});

function render () {
    if (scope.$$state !== STATES.LOADING) return;

    const img = el_content.$$source;

    //  Calculate width and height based on max-width and max-height
    let {naturalWidth : w, naturalHeight : h} = img;
    const {max_width : max_w, max_height : max_h} = scope.options;

    if (w > max_w) {
        h = ~~(max_w * h / w);
        w = max_w;
    }

    if (h > max_h) {
        w = ~~(max_h * w / h);
        h = max_h;
    }

    //  Set ratio to use in processing afterwards ( this is based on original image size )
    scope.meta.ratio = {
        w : Math.round((img.naturalWidth / w) * 100) / 100,
        h : Math.round((img.naturalHeight / h) * 100) / 100,
    };

    //  Set width/height
    scope.meta.dimensions.w = img.width = w;
    scope.meta.dimensions.h = img.height = h;

    scope.$$state = STATES.READY;

    //  Initialize dimensions
    if (scope.options.fixed_size) {
        const {min_crop_width : mcw, min_crop_height : mch} = scope.options;
        const rad = (mcw > mch
            ? mcw
            : mch) * .5;

        const x_center = w * .5;
        const y_center = h * .5;

        scope.meta.dimensions.x = x_center - rad;
        scope.meta.dimensions.x2 = x_center + rad;
        scope.meta.dimensions.y = y_center - rad;
        scope.meta.dimensions.y2 = y_center + rad;

    } else {
        scope.meta.dimensions.x2 = scope.meta.dimensions.w = w;
        scope.meta.dimensions.y2 = scope.meta.dimensions.h = h;
    }

    update();

    scope.options.create_cb({w, h});
}

function update (evt) {
    if (scope.$$state !== STATES.READY) return;
    if (evt) evt.stopPropagation();

    const {dimensions : dim} = scope.meta;

    //  boundary collision checks
    if (dim.x < 0) dim.x = 0;
    if (dim.y < 0) dim.y = 0;
    if (dim.x2 > dim.w) dim.x2 = dim.w;
    if (dim.y2 > dim.h) dim.y2 = dim.h;

    //  Patch updates
    el_overlay.update(dim, scope.options);
    el_handles.update(dim, scope.options);

    scope.options.update_cb(dim);
}

export default class ImageCropper {
    constructor (selector, href, opts = {}) {
        if (!href || !selector) return;

        //  Parse options
        Object.keys(opts || {}).forEach((key) => scope.options[key] = opts[key]);

        //  Set parent
        const el = document.querySelector(selector);

        if (!isElement(el)) throw new TypeError('Does the parent exist?');

        scope.$$parent = el;
        scope.$$parent.classList.add('imgc');

        //  Create a Content instance
        scope.$$parent.addEventListener('DOMNodeRemovedFromDocument', this.destroy);
        scope.$$parent.addEventListener('source:fetched', render, true);
        scope.$$parent.addEventListener('source:dimensions', update, true);

        //  Create Wrapper elements
        el_content = new Content(scope);
        el_overlay = new Overlay(scope);
        el_handles = new Handles(scope);

        this.setImage(href);
    }

    setImage (href) {
        scope.$$state = STATES.LOADING;
        el_content.source(href);
    }

    destroy () {
        scope.$$state = STATES.OFFLINE;

        if (isElement(scope.$$parent)) {
            while (scope.$$parent.firstChild) {
                scope.$$parent.removeChild(scope.$$parent.firstChild);
            }

            //  Clean parent
            scope.$$parent.classList.remove('imgc');
        }

        scope.options.destroy_cb();
    }

    crop (mime_type = 'image/jpeg', quality = 1) {
        mime_type = hasValue(['image/jpeg', 'image/png'], mime_type)
            ? 'image/jpeg'
            : mime_type;

        quality = (quality < 0 || quality > 1)
            ? 1
            : quality;

        const {x, y, x2, y2} = scope.meta.dimensions;
        const {w : rw, h : rh} = scope.meta.ratio;
        const w = x2 - x;   //  width
        const h = y2 - y;   //  height

        const canvas = cell('canvas', null, {
            width : w,
            height : h
        });

        canvas.getContext('2d').drawImage(el_content.$$source, rw * x, rh * y, rw * w, rh * h, 0, 0, w, h);

        return canvas.toDataURL(mime_type, quality);
    }
}
