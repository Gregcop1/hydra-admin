import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import * as _ from 'lodash';
import {ConfigService} from '../../services/config/config';
import {Model} from '../models/Model';

@Injectable()
export class SchemaService {

    schema$: Observable<any>;
    _schemaObserver: any;
    _schema: any;

    constructor(private _http: Http, private _config: ConfigService) {
        this.schema$ = new Observable(observer => this._schemaObserver = observer )
            .share();

        this._schema = {
            title: {},
            models: []
        };
        this.getSchema();
    }

    /**
     * Get schema of the API
     */
    getSchema() {
        let request: string = [this._config.api.url, 'apidoc'].join('/');
        this._http.get(request)
            .map((data) => data.json())
            .subscribe((datas) => {
                // update the store
                this._schema.title = this._getSchemaTitle(datas);
                this._schema.models = this._populateModels(datas);
                // push data to subscribers
                this._schemaObserver.next(this._schema);
            },
                (error) => console.error('Could not reach API for request', request));
    }

    /**
     * Get the title of the schema
     *
     * @param {Response} datas
     *
     * @returns {string}
     * @private
     */
    _getSchemaTitle(datas: any): string {
        return datas['hydra:title'];
    }

    /**
     * Populate models from the schema
     *
     * @param {Response} datas
     *
     * @returns {Array}
     * @private
     */
    _populateModels(datas: Response): Array<Model> {
        return _.map(this._cleanModlesList(datas['hydra:supportedClass']), this._populateModel);
    }

    /**
     * Clean the list of model from polluted datas
     *
     * @param supportedClasses
     *
     * @returns {Array<any>}
     * @private
     */
    _cleanModlesList(supportedClasses: Array<any>): Array<any> {
        return supportedClasses.slice(0, -3);
    }

    /**
     * Transform datas from the schema unti valid Model
     *
     * @param {any} model
     *
     * @returns {Model}
     * @private
     */
    _populateModel(model: any): Model {
        return new Model(model);
    }
}
