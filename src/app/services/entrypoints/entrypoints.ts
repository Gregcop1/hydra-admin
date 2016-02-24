import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {ConfigService} from '../../services/config/config';

@Injectable()
export class EntrypointService {

    entrypoints: any;

    constructor(private _http: Http, private _config: ConfigService) {}

    /**
     * Get entrypoints of the API
     *
     * @returns {Observable<Response>}
     */
    getEntryPoints(): Observable<Response> {
        if (undefined === this.entrypoints) {
            this.entrypoints = this._http.get(this._config.api.url)
                .map((data) => data.json())
                .map(this._filterEntryPoints)
                .share();
            this.entrypoints.subscribe(
                null,
                (error) => console.error(`API's url is unreachable.`, error)
            );
        }
        return this.entrypoints;
    }

    /**
     * @param {any} datas
     *
     * @returns {any}
     * @private
     */
    _filterEntryPoints(datas: any): any {
        return _.omit(datas, ['@context', '@id', '@type']);
    }
}
