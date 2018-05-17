import Content from './components/Content';
import Handles from './components/handles/index';
import Overlay from './components/Overlay';

import {hasValue, copyTo} from './utils/Object';
import {cell, isElement} from './utils/Dom';
import {MODES, STATES} from './constants';

const scopes = {};

function __scope (id, opts) {
    let _state = STATES.OFFLINE;

    const scope = Object.seal(Object.defineProperties({
        $$parent : null,
        el_content : null,
        el_handles : null,
        el_overlay : null,
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
    }, {
        state : {
            get : () => _state,
            set : (state) => {
                _state = state;
                if (scope.$$parent) scope.$$parent.setAttribute('data-imgc-state', state);
            }
        }
    }));

    //  Parse options into the scope
    copyTo(scope.options, opts);

    scopes[id] = Object.seal(scope);

    return scope;
}

function __render () {
    const scope = scopes[this.$$id];

    if (scope.state !== STATES.LOADING) return;

    const img = scope.el_content.$$source;

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

    scope.state = STATES.READY;

    //  Initialize dimensions
    if (scope.options.fixed_size) {
        const {min_crop_width : mcw, min_crop_height : mch} = scope.options;
        const rad = (mcw > mch
            ? mcw
            : mch) * .5;

        copyTo(scope.meta.dimensions, {
            x : (w * .5) - rad,
            x2 : (w * .5) + rad,
            y : (h * .5) - rad,
            y2 : (h * .5) + rad,
        });

    } else {
        copyTo(scope.meta.dimensions, {
            x2 : w,
            y2 : h,
        });
    }

    __update.call(this);

    scope.options.create_cb({w, h});
}

function __update (evt) {
    const scope = scopes[this.$$id];

    if (scope.state !== STATES.READY) return;
    if (evt) evt.stopPropagation();

    const {dimensions : dim} = scope.meta;

    //  boundary collision checks
    if (dim.x < 0) dim.x = 0;
    if (dim.y < 0) dim.y = 0;
    if (dim.x2 > dim.w) dim.x2 = dim.w;
    if (dim.y2 > dim.h) dim.y2 = dim.h;

    //  Patch updates
    scope.el_overlay.update(dim, scope.options);
    scope.el_handles.update(dim, scope.options);

    scope.options.update_cb(dim);
}

export default class ImageCropper {
    constructor (selector, href, opts = {}) {
        if (!href || !selector) return;

        this.$$id = Math.random().toString(36).substring(2);

        const scope = __scope(this.$$id, opts);

        //  Set parent
        const el = selector instanceof HTMLElement ? selector : document.querySelector(selector);

        if (!isElement(el)) throw new TypeError('Does the parent exist?');

        //  Setup parent
        scope.$$parent = el;
        scope.$$parent.classList.add('imgc');
        scope.$$parent.addEventListener('DOMNodeRemovedFromDocument', this.destroy.bind(this));
        scope.$$parent.addEventListener('source:fetched', __render.bind(this), true);
        scope.$$parent.addEventListener('source:dimensions', __update.bind(this), true);

        //  Create Wrapper elements
        scope.el_content = new Content(scope);
        scope.el_overlay = new Overlay(scope);
        scope.el_handles = new Handles(scope);

        this.setImage(href);
    }

    setImage (href) {
        const scope = scopes[this.$$id];

        scope.state = STATES.LOADING;
        scope.el_content.source(href);
    }

    destroy () {
        const scope = scopes[this.$$id];

        scope.state = STATES.OFFLINE;

        if (isElement(scope.$$parent)) {
            while (scope.$$parent.firstChild) {
                scope.$$parent.removeChild(scope.$$parent.firstChild);
            }

            //  Clean parent
            scope.$$parent.classList.remove('imgc');
        }

        scope.options.destroy_cb();
        delete scopes[this.$$id];
    }

    crop (mime_type = 'image/jpeg', quality = 1) {
        const scope = scopes[this.$$id];

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

        canvas.getContext('2d').drawImage(scope.el_content.$$source, rw * x, rh * y, rw * w, rh * h, 0, 0, w, h);

        return canvas.toDataURL(mime_type, quality);
    }
}
