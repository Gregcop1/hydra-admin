import {Component, ViewEncapsulation, OnInit} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
import {EntrypointService} from '../../services/entrypoints/entrypoints';


@Component({
  selector: 'app',
  templateUrl: './app/components/app/app.html',
  styleUrls: ['./app/components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  //{ path: '/', component: HomeCmp, as: 'Home' },
])
export class AppCmp implements OnInit {
  constructor(private entrypointService: EntrypointService) {}

  ngOnInit() {
    this.entrypointService.getEntryPoints()
        .subscribe(null, (error) => console.error(`API's url is unreachable.`, error));
  }
}
