import {Component, ViewEncapsulation} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';


@Component({
  selector: 'app',
  templateUrl: './app/components/app.html',
  styleUrls: ['./app/components/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  //{ path: '/', component: HomeCmp, as: 'Home' },
])
export class AppCmp {}
