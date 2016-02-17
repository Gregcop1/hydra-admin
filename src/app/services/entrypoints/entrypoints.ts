import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/Observable';
import {ConfigService} from '../../services/config/config';

@Injectable()
export class EntrypointService {

    _entryPointsObservable: Observable<Response>;

    constructor(private _http: Http, private _config: ConfigService) {}

    /**
     * Get entrypoints of the API
     *
     * @returns {Observable<Response>}
     */
    getEntryPoints(): Observable<Response> {
        if (this._entryPointsObservable === undefined) {
            this._entryPointsObservable = this._http.get(this._config.api.url)
                .map((data) => this._getEntryPointsList(data.json()));
        }

        return this._entryPointsObservable;
    }

    /**
     * @param {any} datas
     *
     * @returns {any}
     * @private
     */
    _getEntryPointsList(datas: any): any {
        return _.omit(datas, ['@context', '@id', '@type']);
    }
}
