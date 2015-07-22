# Lightweight Javascript ImageCropper 0.1

A lightweight javascript imagecropper written in vanilla js
with zero-dependency injection

# Getting Started

To get started, you need only do a couple things 

1. Include the minified js and css files into your dom (or build process)
2. Create a HTML element for the imagecropper to be built into 
3. Run the imagecropper function with the url for the image that needs to be cropped
4. Create a button to call the crop function on the imagecropper.

# Creating an imagecropper instance
Creating an imagecropper is done like so 

```javascript
img_c = new ImageCropper(selector, image_url, options);
```

## selector
The selector is an html5 css selector ( such as '#myTestDiv' ), basically anything that works with a querySelector does the job. This should point to the element where you want the imagecropper to be located.

## image_url
This should point to the location of the image that you want to have cropped.

## options (update, max_width, max_height)
There are several possible options defined for the image cropper 

* update
  * Callback function that is called everytime a move/change happens
* max_width
  * Sets the maximum width that the imagecropper can become
* max_height
  * Set the maximum height for the imagecropper

# Cleaning up an imagecropper instance

```javascript
img_c = new ImageCropper('#test-imagecrop', 'img.jpg');
img_c.destroy();
```

# Example
For an example, check out the example folder in the repository
