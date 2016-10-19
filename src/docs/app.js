'use strict';

//  Setup Image cropper

const img_c = new ImageCropper('.test-imagecrop', "http://thecatapi.com/api/images/get");

function addListener (name, cb) {
    const el = document.querySelector(`.${name}`);

    if (!el) return;
    el.addEventListener('click', cb);
}

//  Setup Buttons
addListener('crop-button', img_c.crop);
addListener('change-button', () => img_c.setImage("https://i.ytimg.com/vi/8FF2JvHau2w/maxresdefault.jpg"));
addListener('destroy-button', img_c.destroy);
