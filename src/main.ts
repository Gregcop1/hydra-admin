import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {AppCmp} from './app/components/app/app';
import {EntrypointService} from './app/services/entrypoints/entrypoints';
import {ConfigService} from './app/services/config/config';

bootstrap(AppCmp, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  EntrypointService,
  ConfigService,
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
