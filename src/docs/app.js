'use strict';

//  Setup Image cropper

new ImageCropper('.example-1', "./example1.jpg", {
    max_width : 300,
    max_height : 300,
});
new ImageCropper('.example-2', "./example2.jpg", {
    max_width : 300,
    max_height : 300,
});

//  Size examples

new ImageCropper('.example-size-100', "./example1.jpg", {
    max_width : 100,
    max_height : 100,
    min_crop_width : 50,
    min_crop_height : 50,
});
new ImageCropper('.example-size-200', "./example1.jpg", {
    max_width : 200,
    max_height : 200,
    min_crop_width : 50,
    min_crop_height : 50,
});
new ImageCropper('.example-size-300', "./example1.jpg", {
    max_width : 300,
    max_height : 300,
    min_crop_width : 50,
    min_crop_height : 50,
});

//  Mode example
new ImageCropper('.example-mode-circular', "./example2.jpg", {
    max_width : 300,
    max_height : 300,
    mode : 'circular',
    min_crop_width : 50,
    min_crop_height : 50,
});


//  Fixed
new ImageCropper('.example-fixed-on', "./example2.jpg", {
    max_width : 300,
    max_height : 300,
    fixed_size : true,
    min_crop_width : 50,
    min_crop_height : 50,
});

//  Highlighting
hljs.initHighlightingOnLoad();
