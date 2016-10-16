import {cell} from '../utils/Dom';

export default class Content {
    constructor (parent) {
        this.$$view = cell('div', ['imgc-content'], {}, parent);

        this.$$source = cell('img', null, {}, this.$$view);

        //  Load Image
        this.$$source.addEventListener('load', () => {
            this.$$source.dispatchEvent(new CustomEvent('source:fetched'));
        });
    }

    source (href) {
        this.$$source.src = href;
    }
}
