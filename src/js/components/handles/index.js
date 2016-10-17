import {MODES} from '../../constants';
import {cell} from '../../utils/Dom';
import Handle from './Handle';
import {hasValue} from '../../utils/Object';

export default class Handles {
    constructor (scope) {
        if (!hasValue(MODES, scope.options.mode)) throw new TypeError(`Mode ${scope.options.mode} doesnt exist`);

        this.$$view = cell('div', ['imgc-handles', `imgc-handles-${scope.options.mode}`], {}, scope.$$parent);

        for (let i = 0; i < (scope.options.fixed_size ? 4 : 8); i++) {
            new Handle(this.$$view, i, scope);
        }
    }

    update ({x, x2, y, y2, w, h}) {
        this.$$view.style.top = `${y}px`;
        this.$$view.style.left = `${x}px`;
        this.$$view.style.right = `${~~(w - x2)}px`;
        this.$$view.style.bottom = `${~~(h - y2)}px`;
    }
}
