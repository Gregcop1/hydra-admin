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
        this.getEntryPoints();
    }

    /**
     * Get entrypoints of the API
     */
    getEntryPoints(): void {
        let request: string = this._config.api.url;
        this._http.get(request)
            .map((data) => data.json())
            .map(this._filterEntryPoints)
            .subscribe((datas) => {
                this._entrypointsObserver.next(datas);
            },
                (error) => console.error(`API's url is unreachable; ${request}.`, error));
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
