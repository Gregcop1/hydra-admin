import {Injectable} from 'angular2/core';
import configuration from '../../../configuration';

@Injectable()
export class ConfigService {
    api: any = {};

    constructor() {
        this._hookMeIfYouCan(configuration);
    }

    /**
     * @param config
     * @private
     */
    _hookMeIfYouCan(_config: any):void {
        for(let key in _config) {
            if(_config.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                this[key] = _config[key];
            }
        }
    }
}
