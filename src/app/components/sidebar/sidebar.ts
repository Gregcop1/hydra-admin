import {Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES, Media} from 'ng2-material/all';
import {SchemaService} from '../../services/schema/schema';
import {Model} from '../../services/models/Model';

@Component({
  selector: 'sidebar',
  templateUrl: './app/components/sidebar/sidebar.html',
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES]
})
export class SideBarCmp implements OnInit {

  defaultModel: Array<any> = [new Model({
    'hydra:title': 'Home',
    'link': ['Home']
  })];
  models: Array<any> = [];
  currentModel: Model;

    constructor(private schemaService: SchemaService, private _media: Media) {}

  /**
   * Init services
   */
  ngOnInit(): void {
    this.schemaService.schema$
      .filter(schema => null !== schema)
      .map(schema => this.defaultModel.concat(schema.models))
      .subscribe(models => this.models = models);
  }

    /**
     * Check for media size
     *
     * @param breakSize
     *
     * @returns {boolean}
     */
    hasMedia(breakSize: string): boolean {
        return this._media.hasMedia(breakSize);
    }

  /**
   * Switch current model
   * @param model
   */
  switch(model: Model): void {
    this.currentModel = model;
  }
}
