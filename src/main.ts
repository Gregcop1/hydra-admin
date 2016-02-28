import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {MATERIAL_PROVIDERS} from 'ng2-material/all';
import {AppCmp} from './app/components/app/app';
import {EntrypointService} from './app/services/entrypoints/entrypoints';
import {SchemaService} from './app/services/schema/schema';
import {ConfigService} from './app/services/config/config';

bootstrap(AppCmp, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  EntrypointService,
  SchemaService,
  ConfigService,
  MATERIAL_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
