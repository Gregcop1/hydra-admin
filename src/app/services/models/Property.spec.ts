import { it,
    describe,
    expect,
    beforeEach
} from 'angular2/testing';
import {Property} from './Property';

export function main() {

    describe('Property model', () => {
        let schema: any,
            property: Property;

        beforeEach(() => {
            schema = {
                'hydra:title': 'firstName',
                'hydra:property': {'@type': 'text'},
                'hydra:required': true,
                'hydra:readable': true,
                'hydra:writable': true
            };
            property = new Property();
        });

        it('should populate the property with right datas', () => {
            property.populate(schema);

            expect(property.label).toEqual('firstName');
            expect(property.type).toEqual('text');
            expect(property.required).toBeTruthy();
            expect(property.readable).toBeTruthy();
            expect(property.writable).toBeTruthy();
        });
    });
};
