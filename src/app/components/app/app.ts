import {Component, ViewEncapsulation} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {HeaderCmp} from '../header/header';
import {SideBarCmp} from '../sidebar/sidebar';

@Component({
  selector: 'app',
  templateUrl: './app/components/app/app.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, HeaderCmp, SideBarCmp]
})
@RouteConfig([
  //{ path: '/', component: HomeCmp, as: 'Home' },
])
export class AppCmp {}
