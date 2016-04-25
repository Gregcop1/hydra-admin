import { it,
    describe,
    expect
    beforeEach
} from 'angular2/testing';
import {Model} from './Model';

export function main() {

    describe('Model model', () => {
        let schema: any,
            properties: Array<any>,
            model: Model;

        beforeEach(() => {
            properties = ['firstName', 'lastName'];
            schema = {
                'hydra:title': 'Person',
                'hydra:description': 'Informations about the Person',
                'hydra:supportedProperty': properties
            };
            model = new Model();
        });

        it('should populate the model with right datas', () => {
            spyOn(model, '_getProperties')
                .and.returnValue(properties);

            model.populate(schema);

            expect(model.title).toEqual('Person');
            expect(model.description).toEqual('Informations about the Person');
            expect(model.properties.length).toEqual(2);

            expect(model._getProperties).toHaveBeenCalled();
            expect(model._getProperties).toHaveBeenCalledWith(properties);
        });
    });
};
