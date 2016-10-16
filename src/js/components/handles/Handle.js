import {cell} from '../../utils/Dom';
import {convertGlobalToLocal} from '../../utils/Event';

//
//  CALLBACKS FOR EACH TYPE OF HANDLE
//

    const HANDLES_CBS = Object.freeze([
        (evt, dimensions, options) => { //  TOP LEFT
            const {x} = dimensions.x;

            HANDLES_CBS[7](evt, dimensions, options);

            if (!options.fixed_size) HANDLES_CBS[4](evt, dimensions, options);
            else {
                if (dimensions.y + dimensions.x - x < 0) {
                    dimensions.x = x - dimensions.y;
                    dimensions.y = 0;
                } else {
                    dimensions.y += dimensions.x - x;
                }
            }
        },
        (evt, dimensions, options) => { //  TOP RIGHT
            const {x2} = dimensions;

            HANDLES_CBS[5](evt, dimensions, options);

            if (!options.fixed_size) HANDLES_CBS[4](evt, dimensions, options);
            else {
                if (dimensions.y - dimensions.x2 + x2 < 0) {
                    dimensions.x2 = x2 + dimensions.y;
                    dimensions.y = 0;
                } else {
                    dimensions.y -= dimensions.x2 - x2;
                }
            }
        },
        (evt, dimensions, options, source) => { //  BOTTOM RIGHT
            const {x2} = dimensions;

            HANDLES_CBS[5](evt, dimensions, options);

            if (!options.fixed_size) HANDLES_CBS[6](evt, dimensions, options);
            else {
                const source_dimensions = source.getBoundingClientRect();

                if (dimensions.y2 + dimensions.x2 - x2 > source_dimensions.height) {
                    dimensions.x2 = x2 + (source_dimensions.height - dimensions.y2);
                    dimensions.y2 = source_dimensions.height;
                } else {
                    dimensions.y2 += dimensions.x2 - x2;
                }
            }
        },
        (evt, dimensions, options, source) => { //  BOTTOM LEFT
            const {x} = dimensions;

            HANDLES_CBS[7](evt, dimensions, options);

            if (!options.fixed_size) HANDLES_CBS[6](evt, dimensions, options);
            else {
                const source_dimensions = source.getBoundingClientRect();

                if (dimensions.y2 + (x - dimensions.x) > source_dimensions.height) {
                    dimensions.x = x - (source_dimensions.height - dimensions.y2);
                    dimensions.y2 = source_dimensions.height;
                } else {
                    dimensions.y2 -= dimensions.x - x;
                }
            }
        },
        //  TOP
        (evt, dimensions, options) => dimensions.y = (dimensions.y2 - evt.y < options.min_crop_height)
            ? dimensions.y2 - options.min_crop_height
            : evt.y,
        //  RIGHT
        (evt, dimensions, options) => dimensions.x2 = (evt.x - dimensions.x < options.min_crop_width)
            ? dimensions.x + options.min_crop_width
            : evt.x,
        //  BOTTOM
        (evt, dimensions, options) => dimensions.y2 = (evt.y - dimensions.y < options.min_crop_height)
            ? dimensions.y + options.min_crop_height
            : evt.y,
        //  LEFT
        (evt, dimensions, options) => dimensions.x = (dimensions.x2 - evt.x < options.min_crop_width)
            ? dimensions.x2 - options.min_crop_width
            : evt.x,
    ]);

//
//  MOUSE EVENTS
//

    function handleMouseDown (evt) {
        evt.stopPropagation();

        document.addEventListener('mouseup', handleMouseUp.bind(this));
        document.addEventListener('mousemove', handleMouseMove.bind(this));
    }

    function handleMouseUp (evt) {
        evt.stopPropagation();

        document.removeEventListener('mouseup', handleMouseUp.bind(this));
        document.removeEventListener('mousemove', handleMouseMove.bind(this));
    }

    function handleMouseMove (evt) {
        evt.stopPropagation();

        HANDLES_CBS[this.$$type](
            convertGlobalToLocal(evt, this.$$scope.elements.source.getBoundingClientRect()),
            this.$$scope.meta.dimensions,
            this.$$scope.options,
            this.$$scope.elements.source
        );
    }

//
//  PUBLIC
//

    export default class Handle {
        constructor (parent, type) {
            this.$$view = cell('span', ['imgc-handles-el', `imgc-handles-el-${~~(type / 4)}-${type % 4}`], {}, parent);

            //  Bootstrap element
            this.$$view.addEventListener('mousedown', handleMouseDown.bind(this));

            //  Set options
            this.$$type = type;
        }
    }
