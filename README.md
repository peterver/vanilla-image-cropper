# Lightweight Javascript ImageCropper 0.1

A lightweight javascript imagecropper written in vanilla js
with zero-dependency injection

# Getting Started

To get started, you need only do a couple things 

1. Include the minified js and css files into your dom (or build process)
2. Create a HTML element for the imagecropper to be built into 
3. Run the imagecropper function with the url for the image that needs to be cropped
4. Create a button to call the crop function on the imagecropper.

# Requirements

* Browserify ( or something else that works with module.exports ) 

# Creating an imagecropper instance
Creating an imagecropper is done like so 

```javascript
var ImageCropper = require('./imagecrop.min.js');
img_c = new ImageCropper(selector, image_url, options);
```

### selector
The selector is an html5 css selector ( such as '#myTestDiv' ), basically anything that works with a querySelector does the job.

It should point to the element where you want the imagecropper to be located.

### image_url
The image_url should point to the location of the image that you want to have cropped. Meaning the url of the source image.

### options (update, max_width, max_height)
There are several possible options defined for the image cropper 

* update
  * Callback function that is called everytime a move/change happens
* max_width
  * Sets the maximum width that the imagecropper can become
* max_height
  * Sets the maximum height for the imagecropper

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
