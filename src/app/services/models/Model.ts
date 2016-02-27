import * as _ from 'lodash';
import {Property} from './Property';

export class Model {

    public title: string;
    public title: string;
    public description: string;
    public properties: Array<Property>;
    public operations: Array<string>;

    constructor(datas: any) {
        if (datas) {
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
        return _.map(properties, (property) => new Property(property));
    }

}
