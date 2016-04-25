import {
  it,
  describe,
  expect,
  inject,
  fakeAsync,
  beforeEachProviders,
  beforeEach,
  tick
} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';
import {provide} from 'angular2/core';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions
} from 'angular2/http';
import 'rxjs/add/operator/filter';
import {APIService} from './api';
import {ConfigService} from '../config/config';
import {SchemaService} from '../schema/schema';
import {PagedCollection} from '../models/PagedCollection';
import {EntryPoint} from '../models/EntryPoint';

export function main() {

  describe('API service', () => {
    let apiService: APIService,
      configService: ConfigService,
      schemaService: SchemaService,
      mockBackend: MockBackend;

    beforeEachProviders(() => {
      return [
        BaseRequestOptions,
        MockBackend,
        APIService,
        SchemaService,
        provide(ConfigService, {
          useValue: {
            api: {
              url: 'http://localhost:8000'
            }
          }
        }),
        provide(Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
      ];
    });

    beforeEach(
      inject(
        [APIService, SchemaService, ConfigService, MockBackend],
        fakeAsync((_apiService, _schemaService, _configService, _mockBackend) => {
          apiService = _apiService;
          schemaService = _schemaService;
          configService = _configService;
          mockBackend = _mockBackend;
        })
      )
    );

    describe('#getCollectionByUrl', () => {

      it('should load api definition', inject([], fakeAsync(() => {
        mockBackend.connections.subscribe(c => {
          expect(c.request.url).toBe('http://localhost:8000/people');
          let response = new ResponseOptions({
            body: {
              '@context': '/contexts/Person',
              '@id': '/people',
              '@type': 'hydra:PagedCollection',
              'hydra:totalItems': 2,
              'hydra:itemsPerPage': 30,
              'hydra:firstPage': '/people',
              'hydra:lastPage': '/people',
              'hydra:member': [
                {
                  '@id': '/people/1',
                  '@type': 'http://schema.org/Person',
                  'familyName': 'Doe'
                },
                {
                  '@id': '/people/2',
                  '@type': 'http://schema.org/Person',
                  'familyName': 'Norris'
                }
              ]
            }
          });
          c.mockRespond(new Response(response));
        });

        let query$ = apiService.getCollectionByUrl('http://localhost:8000/people');
        tick();

        query$.subscribe(collection => {
          expect(collection instanceof PagedCollection).toBeTruthy();
          expect(collection.members.length).toBe(2);
        });

      })));

      it('should throw Error if API is unreachable', () => {
        mockBackend.connections.subscribe(c => {
          c.mockError();
        });

        expect(() => apiService.getCollectionByUrl('')).toThrow();
      });

    });

    describe('#getCollection', () => {

      beforeEach(() => {
        spyOn(apiService, 'getCollectionByUrl');

        let entrypoint = new EntryPoint('person');
        entrypoint.url = '/people';
        apiService.entrypoints = [
          entrypoint
        ];
      });

      it('should call API to get collection of a known model', () => {
        apiService.getCollection('person');

        expect(apiService.getCollectionByUrl).toHaveBeenCalled();
        expect(apiService.getCollectionByUrl).toHaveBeenCalledWith('http://localhost:8000/people');
      });

      it('should not call API if model is unknown', () => {
        expect(() => apiService.getCollection()).toThrow();
        expect(apiService.getCollectionByUrl).not.toHaveBeenCalled();
      });

    });

  });
};
