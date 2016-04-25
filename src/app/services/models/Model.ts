import * as _ from 'lodash';
import {Property} from './Property';

export class Model {

    public title: string = '';
    public description: string = '';
    public properties: Array<Property> = [];
    public operations: Array<string> = [];

    populate(datas: any) {
        if (!datas) {
            console.error('Wrong parameter: you should set datas to populate Model model, none give.');
        } else {
            this.title = datas['hydra:title'];
            this.description = datas['hydra:description'];
            this.properties = this._getProperties(datas['hydra:supportedProperty']);
        }
    }

    /**
     * Extract properties from the a Model's schema
     *
     * @param properties
     *
     * @returns {Array<Property>}
     * @private
     */
    _getProperties(properties) {
        return _.map(properties, (schema) => {
            let property: Property = new Property();
            property.populate(schema);
            return property;
        });
    }

}
