import {Component, ViewEncapsulation, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {HeaderCmp} from '../header/header';
import {SideBarCmp} from '../sidebar/sidebar';
import {HomeCmp} from '../home/home';
import {ListCmp} from '../list/list';
import {SchemaService} from '../../services/schema/schema';

@Component({
  selector: 'app',
  templateUrl: './app/components/app/app.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, HeaderCmp, SideBarCmp]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/list/:model', as: 'List',  component: ListCmp }
])
export class AppCmp implements OnInit {

  constructor(private _schemaService: SchemaService) {}

  ngOnInit() {
      this._schemaService.load();
  }
}
