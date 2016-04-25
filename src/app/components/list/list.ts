import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {Model} from '../../services/models/Model';
import {SchemaService} from '../../services/schema/schema';
import {APIService} from '../../services/api/api';
import {PropertyPipe} from '../../pipes/PropertyPipe';
import {PagedCollection} from '../../services/models/PagedCollection';

@Component({
  selector: 'content',
  templateUrl: './app/components/list/list.html',
  directives: [MATERIAL_DIRECTIVES],
  pipes: [PropertyPipe]
})
export class ListCmp implements OnInit {
  public model: any = {};
  public collection: PagedCollection;
  public loading: boolean = false;

  constructor(private _routeParams: RouteParams, private _schemaService: SchemaService, private _api: APIService) {}

  ngOnInit() {
    let modelName = this._routeParams.get('model');

    this._schemaService.schema$
      .filter((schema) => null !== schema)
      .map(schema => schema.models)
      .switchMap(schema => schema)
      .filter((model: Model) => model.title === modelName)
      .subscribe(model => {
        this.loading = false;
        this.model = model;

        this._getCollection(modelName);
      });

  }

  _getCollection(modelName: string) {
    this._api.getCollection(modelName)
      .subscribe(collection => this.collection = collection);
  }
}
