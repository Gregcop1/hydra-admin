import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import * as _ from 'lodash';
import {ConfigService} from '../../services/config/config';

@Injectable()
export class EntrypointService {

    entrypoints$: Observable<any>;
    _entrypointsObserver: any;

    constructor(private _http: Http, private _config: ConfigService) {
        this.entrypoints$ = new Observable(observer => this._entrypointsObserver = observer)
            .share();
    }

    /**
     * Get entrypoints of the API
     */
    getEntryPoints(): void {
        let request: string = this._config.api.url;
        this._http.get(request)
            .map((data) => data.json())
            .map(this._filterEntryPoints)
            .subscribe(
                (datas) => this._updateEntryPointsObserver(datas),
                (error) => console.error(`API's url is unreachable : ${request}.`, error)
            );
    }

    /**
     * Update the entrypoints observer
     *
     * @param datas
     * @private
     */
    _updateEntryPointsObserver(datas: Response): void {
        if (this._entrypointsObserver) {
            this._entrypointsObserver.next(datas);
        }
    }

    /**
     * @param {any} datas
     *
     * @returns {Response} datas
     * @private
     */
    _filterEntryPoints(datas: Response): any {
        return _.omit(datas, ['@context', '@id', '@type']);
    }
}
