# Lightweight Javascript ImageCropper

[![Build Status](https://travis-ci.org/peterver/vanilla-image-cropper.svg?branch=master)](https://travis-ci.org/peterver/vanilla-image-cropper)
[![npm](https://img.shields.io/npm/v/image_cropper.svg)](https://www.npmjs.com/package/image_cropper)
[![npm](https://img.shields.io/npm/dt/image_cropper.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/l/image_cropper.svg?maxAge=2592000)]()
<a target="_blank" href="https://www.paypal.me/peterver"><img src="https://img.shields.io/badge/PayPal-Donate-blue.svg?style=flat" title="Buy me a beer" alt="Buy me a beer"/></a>
[![David](https://img.shields.io/david/peterver/image-crop.svg?maxAge=2592000)]()

A lightweight javascript imagecropper written in vanilla js
with zero-dependency injection that builds itself into an object.

For a live preview and some example code, visit [http://peterver.github.io/vanilla-image-cropper/](http://peterver.github.io/vanilla-image-cropper/)

# Getting Started

```javascript
var img_c = new ImageCropper(selector, image, options);
```

### selector
The selector is an html5 css selector ( such as '#myTestDiv' ), basically anything that works with a querySelector does the job.

It should point to the element where you want the imagecropper to be located.

### image
The image can either be a javascript Image object loaded through a FileReader, this can be done like so
```javascript
var reader = new FileReader();

reader.onload = function (evt) {
  var img_c = new ImageCropper(..., evt.target.result, ...);
};

reader.readAsDataURL(...myfile...);
```

Or you can simply pass an existing url, for example 

```javascript
var img_c = new ImageCropper(..., '../assets/my_img.jpg', ...);
```

### options
There are several possible options defined for the image cropper 

* **max_width**<br>
  Sets the maximum width that the imagecropper can become<br><br>
* **max_height**<br>
  Sets the maximum height for the imagecropper<br><br>
* **min_crop_width**<br>
  The minimum width that the cropped image can be<br><br>
* **min_crop_height**<br>
  The miminum height that the cropped image can be<br><br>
* **create_cb**<br>
  A callback function that is called when the imagecropper has finished creating, this will pass an object containing the dimensions of the imagecropper ( for styling or positioning purposes )<br><br>
* **update_cb**<br>
 Callback function that is called everytime a move/change happens<br><br>
* **destroy_cb**<br>
  A callback function that is called when the imagecropper has finished destroying itself<br><br>
* **fixed_size**<br>
  A boolean ( true | false ), that tells the image cropper if it should constrain the size of the cropped area to be fixed or not ?<br><br>
* **mode** (default = 'square')<br>
  Sets the type of preview you should see when using the image cropper, possible options are
  * _'square'_
  * _'circular'_

# Cropping an image (mime_type, quality)
When you're all done with your changes, you can crop the image by calling the **crop** function.

This will return a base64 string that you can then do some funky stuff with.

```javascript
var img_b64_str = img_c.crop(mime_type, quality);
... // do some funky stuff here
```

### mime_type ( default = 'image/jpeg')
The following mime_types are currently supported in this build, they need to be passed as a string value.
* image/jpeg
* image/png

### Quality
The quality is a numeric value between 0 and 1. Where 1 is the highest quality setting, and 0 is the lowest quality setting. 

# Cleaning up an imagecropper instance

```javascript
img_c = new ImageCropper('#test-imagecrop', 'img.jpg');
img_c.destroy();
```

or you can just delete the dom node that the image cropper was created in ( or its parent ),
and the imagecropper instance will destroy itself :]

# Example
For an example, check out the example folder in the repository

# Author
Peter Vermeulen
