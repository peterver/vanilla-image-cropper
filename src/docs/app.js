'use strict';

//  Setup Image cropper

const example_1 = new ImageCropper('.example-1', "./example1.jpg");
const example_2 = new ImageCropper('.example-2', "./example2.jpg");

//  Size examples

const example_size_100 = new ImageCropper('.example-size-100', "./example1.jpg", {
    max_width : 100,
    max_height : 100,
    min_crop_width : 50,
    min_crop_height : 50,
});
const example_size_200 = new ImageCropper('.example-size-200', "./example1.jpg", {
    max_width : 200,
    max_height : 200,
    min_crop_width : 50,
    min_crop_height : 50,
});
const example_size_300 = new ImageCropper('.example-size-300', "./example1.jpg", {
    max_width : 300,
    max_height : 300,
    min_crop_width : 50,
    min_crop_height : 50,
});

//  Live preview

const example_live_preview_target = document.querySelector('.example-live-preview-target');

const example_live_preview = new ImageCropper('.example-live-preview', "./example1.jpg", {
    max_width : 700,
    max_height : 700,
    fixed_size : true,
    min_crop_width : 100,
    min_crop_height : 100,
    update_cb : (dim) => {
        const b64 = example_live_preview.crop('image/jpeg', 1);
        example_live_preview_target.src = b64;

        console.log(`bytes : ${parseInt((b64).replace(/=/g,"").length * 0.75)}`);
    }
});

//  Highlighting
hljs.initHighlightingOnLoad();