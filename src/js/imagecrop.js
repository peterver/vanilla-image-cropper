import Content from './components/Content';
import Handles from './components/handles/index';
import Overlay from './components/Overlay';

import {isElement} from './utils/Dom';
import {MODES, STATES} from './constants';

let scope = Object.seal({
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
    elements : {
        content : null,
        overlay : null,
        handles : null
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
        mode : MODES.SQUARE,
    },
});

function render () {
    if (scope.$$state !== STATES.LOADING) return;

    const img = scope.elements.content.$$source;

    //  Calculate width and height based on max-width and max-height
    let {naturalWidth : w, naturalHeight : h} = img;

    if (w > scope.options.max_width) {
        h = ~~(scope.options.max_width * h / w);
        w = scope.options.max_width;
    }

    if (h > scope.options.max_height) {
        w = ~~(scope.options.max_height * w / h);
        h = scope.options.max_height;
    }

    //  Set ratio to use in processing afterwards ( this is based on original image size )
    scope.meta.ratio = {
        w : Math.round((img.naturalWidth / w) * 100) / 100,
        h : Math.round((img.naturalHeight / h) * 100) / 100,
    };

    //  Set width/height
    img.width = w;
    img.height = h;

    scope.$$state = STATES.READY;

    //  Initialize dimensions
    scope.meta.dimensions.x2 = scope.meta.dimensions.w = w;
    scope.meta.dimensions.y2 = scope.meta.dimensions.h = h;

    scope.meta.dimensions.x = 50;
    scope.meta.dimensions.y = 50;
    scope.meta.dimensions.x2 = 100;
    scope.meta.dimensions.y2 = 100;

    update();
}

function update () {
    if (scope.$$state !== STATES.READY) return;

    const {dimensions : dim} = scope.meta;

    //  boundary collision checks
    if (dim.x < 0) dim.x = 0;
    if (dim.y < 0) dim.y = 0;
    if (dim.x2 > dim.w) dim.x2 = dim.w;
    if (dim.y2 > dim.h) dim.y2 = dim.h;

    //  Patch updates
    scope.elements.overlay.update(dim, scope.options);
    scope.elements.handles.update(dim, scope.options);
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

        //  Create Wrapper elements
        scope.elements.content = new Content(scope.$$parent, scope.options);
        scope.elements.overlay = new Overlay(scope.$$parent, scope.options);
        scope.elements.handles = new Handles(scope.$$parent, scope.options);

        this.setImage(href);
    }

    setImage (href) {
        scope.$$state = STATES.LOADING;
        scope.elements.content.source(href);
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
    }

    crop () {
    }
}
