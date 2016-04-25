import { Pipe } from 'angular2/core';

@Pipe({ name: 'property' })
export class PropertyPipe {
    transform(target: Object, [property,]: any) {
        if(undefined !== property && true === property.readable && target.hasOwnProperty(property.label)) {
            return target[property.label];
        }

        return null;
    }
}
