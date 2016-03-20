describe("ImageCropper Basics", function () {
    var el;
    var imgc;

    beforeEach(
        function () {
            el = document.createElement('div');
            el.className = 'test-imagecrop';
            document.body.appendChild(el);

            imgc = new ImageCropper('.test-imagecrop', 'base/tests/assets/img.jpg');
        }
    );

    afterEach(
        function () {
            el.parentNode.removeChild(el);
        }
    );

    //  BASICS

    it("should have a function named create", function () {
        expect(imgc.create).toBeDefined();
    });

    it("should have a function named crop", function () {
        expect(imgc.crop).toBeDefined();
    });

    it("should have a function named destroy", function () {
        expect(imgc.destroy).toBeDefined();
    });

    it("should have a class named imgc", function () {
        expect(el.className).toContain('imgc');
    });
});

describe("ImageCropper - Children", function () {
    var el;
    var imgc;

    beforeEach(
        function () {
            el = document.createElement('div');
            el.className = 'test-imagecrop';
            document.body.appendChild(el);

            imgc = new ImageCropper('.test-imagecrop', 'base/tests/assets/img.jpg');
            imgc.create();
        }
    );

    afterEach(
        function () {
            el.parentNode.removeChild(el);
        }
    );

    it("should contain img", function () {
        var img_el = document.querySelector('.imgc img');
        expect(img_el).not.toBeUndefined();
        expect(img_el.tagName.toLowerCase()).toBe('img');

        expect(
            img_el.src.split('/').pop()
        ).toBe('img.jpg');
    });

    it("should contain svg", function () {
        var img_el = document.querySelector('.imgc svg');

        expect(img_el).not.toBeUndefined();
        expect(img_el.tagName.toLowerCase()).toBe('svg');
    });

    it("should contain handles", function () {
        var img_el = document.querySelector('.imgc div.imgc-handles');

        expect(img_el).not.toBeUndefined();
        expect(img_el.tagName.toLowerCase()).toBe('div');
        expect(img_el.className).toContain('imgc-handles');
        expect(img_el.childNodes.length).toBe(8);
    });
});