import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/last';
import * as _ from 'lodash';
import {ConfigService} from '../config/config';
import {entrypointHelper} from '../../helper/entrypointHelper';
import {schemaHelper} from '../../helper/schemaHelper';
import {EntryPoint} from '../models/EntryPoint';
import {stringHelper} from '../../helper/stringHelper';

@Injectable()
export class SchemaService {

  schema$: BehaviorSubject<any>;
  entrypoints$: BehaviorSubject<Array<EntryPoint>>;
  _entrypoints: Array<EntryPoint> = [];

  constructor(private _http: Http, private _config: ConfigService) {
    this.schema$ = new BehaviorSubject(null);
    this.entrypoints$ = new BehaviorSubject([]);
  }

  /**
   * load API description
   */
  load() {
    this._loadRoot();
    this._loadDocumentation();
  }

  /**
   * load available entrypoints from API's root
   * @private
   */
  _loadRoot() {
    let request: string = this._config.api.url;
    let entrypoints = this._http.get(request)
      .map(data => data.json())
      .map(entrypointHelper.filterEntryPoints);

    entrypoints.subscribe(
      (entrypoints => {
        _.forEach(_.keys(entrypoints), (key) => {
          let cleanModel = stringHelper.toCamelCase(entrypointHelper.getModelById(key)),
            entrypoint: EntryPoint = entrypointHelper.getEntryPointByModel(key, this._entrypoints);

          if (undefined === entrypoint) {
            entrypoint = new EntryPoint(cleanModel);
            this._entrypoints.push(entrypoint);
          }

          entrypoint.url = entrypoints[key];
        });
        this.entrypoints$.next(this._entrypoints);
      }),
      () => {
        throw new Error(`API's url is unreachable: ${request}.`);
      }
    );
  }

  /**
   * load documentation about the API
   */
  _loadDocumentation() {
    let request = [this._config.api.url, 'apidoc'].join('/'),
      apidoc$ = this._http.get(request)
        .map(data => data.json())
        .share();

    apidoc$.subscribe(
      null,
      () => {
        throw new Error(`API's url is unreachable: ${request}.`);
      }
    );

    let api = apidoc$.map(data => data['hydra:supportedClass'])
      .map(entrypointHelper.filterSupportedClass)
      .switchMap(results => results);

    this._loadCollectionOperations(api);
    this._loadSingleOperations(api);
    this._loadSchema(apidoc$);

  }

  /**
   * Load collection operations
   *
   * @param {Observable<any>} api
   * @param {string} request
   * @private
   */
  _loadCollectionOperations(api: Observable<any>) {
    api.filter(item => item['@id'] === '#Entrypoint')
      .map(entrypoints => entrypoints['hydra:supportedProperty'])
      .switchMap(entrypoint => entrypoint)
      .map(entrypoint => entrypoint['hydra:property'])
      .subscribe(
        (entrypoint => {
          let cleanModel = stringHelper.toCamelCase(entrypointHelper.getModelById(entrypoint['@id'])),
            ep: EntryPoint = entrypointHelper.getEntryPointByModel(cleanModel, this._entrypoints);

          if (undefined === ep) {
            ep = new EntryPoint(cleanModel);
            this._entrypoints.push(ep);
          }

          let operations: Array<string> = entrypointHelper.getOperations(entrypoint['hydra:supportedOperation']);
          ep.addOperations(operations);

          this.entrypoints$.next(this._entrypoints);
        })
      );
  }

  /**
   * Load single operations
   *
   * @param {Observable<any>} api
   * @param {string} request
   * @private
   */
  _loadSingleOperations(api: Observable<any>) {
    api.filter(item => item['@id'] !== '#Entrypoint')
      .subscribe(
        (entrypoint => {
          let cleanModel = stringHelper.toCamelCase(entrypointHelper.getModelById(entrypoint['hydra:title'])),
            ep: EntryPoint = entrypointHelper.getEntryPointByModel(cleanModel, this._entrypoints),
            operations: Array<string> = entrypointHelper.getOperations(entrypoint['hydra:supportedOperation']);

          if (undefined === ep) {
            ep = new EntryPoint(cleanModel);
            this._entrypoints.push(ep);
          }

          ep.addOperations(operations);

          this.entrypoints$.next(this._entrypoints);
        })
      );
  }

  /**
   * Load schema of the API
   */
  _loadSchema(apidoc$: Observable<string>): void {
    apidoc$
      .map(data => {
        return {
          title: schemaHelper.getSchemaTitle(data),
          models: schemaHelper.populateModels(data)
        };
      })
      .subscribe(schema => this.schema$.next(schema));
  }
}
