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
import {ConfigService} from '../config/config';
import {SchemaService} from './schema';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/filter';
import {EntryPoint} from '../models/EntryPoint';

export function main() {

  describe('Schema service', () => {
    let schemaService: SchemaService,
      configService: ConfigService,
      mockBackend: MockBackend;

    beforeEachProviders(() => {
      return [
        BaseRequestOptions,
        MockBackend,
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

    beforeEach(inject([SchemaService, ConfigService, MockBackend], fakeAsync((_schemaService, _configService, _mockBackend) => {
      schemaService = _schemaService;
      configService = _configService;
      mockBackend = _mockBackend;
    })));

    describe('#constructor', () => {

      it('should init schema$ observable', done => {
        schemaService.schema$.subscribe(schema => {
          expect(schema).toBeNull();
          done();
        });
      });

      it('should init entrypoints$ observable', done => {
        schemaService.entrypoints$.subscribe(schema => {
          expect(Array.isArray(schema)).toBeTruthy();
          expect(schema.length).toBe(0);
          done();
        });
      });

    });

    describe('#load', () => {

      it('should load api definition', () => {
        spyOn(schemaService, '_loadRoot');
        spyOn(schemaService, '_loadDocumentation');

        schemaService.load();

        expect(schemaService._loadRoot).toHaveBeenCalled();
        expect(schemaService._loadDocumentation).toHaveBeenCalled();
      });

    });

    describe('~_loadRoot', () => {

      it('should load api definition', () => {
        mockBackend.connections.subscribe(c => {
          expect(c.request.url).toBe('http://localhost:8000');
          let response = new ResponseOptions({
            body: {
              '@context': '/contexts/Entrypoint',
              '@id': '/',
              '@type': 'Entrypoint',
              'person': '/people',
              'blogPosting': '/blog_postings'
            }
          });
          c.mockRespond(new Response(response));
        });

        schemaService.entrypoints$
          .filter(entrypoints => 0 < entrypoints.length)
          .subscribe(entrypoints => {
            expect(entrypoints.length).toBe(2);
            expect(entrypoints[0] instanceof EntryPoint).toBeTruthy();
          });

        schemaService._loadRoot();
      });

      it('should throw Error if API is unreachable', () => {
        mockBackend.connections.subscribe(c => {
          c.mockError();
        });

        expect(() => schemaService._loadRoot()).toThrow();
      });

    });

    describe('~_loadDocumentation', () => {

      it('should load operations and schema', inject([], fakeAsync(() => {
        mockBackend.connections.subscribe(c => {
          expect(c.request.url).toBe('http://localhost:8000/apidoc');
          let response = new ResponseOptions({
            body: {
              'hydra:title': 'Hydra API Test',
              'hydra:supportedClass': [
                {'@id': 'http://schema.org/Person'},
                {'@id': 'http://schema.org/BlogPosting'},
                {'@id': '#Entrypoint'},
                {'@id': '#ConstraintViolation'},
                {'@id': '#ConstraintViolationList'}
              ]
            }
          });
          c.mockRespond(new Response(response));
        });

        spyOn(schemaService, '_loadCollectionOperations');
        spyOn(schemaService, '_loadSingleOperations');
        spyOn(schemaService, '_loadSchema');

        schemaService._loadDocumentation();
        tick();

        expect(schemaService._loadCollectionOperations).toHaveBeenCalled();
        expect(schemaService._loadSingleOperations).toHaveBeenCalled();
        expect(schemaService._loadSchema).toHaveBeenCalled();
      })));

      it('should throw Error if API is unreachable', () => {
        mockBackend.connections.subscribe(c => {
          c.mockError();
        });

        expect(() => schemaService._loadDocumentation()).toThrow();
      });
    });

    describe('~_loadCollectionOperations', () => {

      it('should load collection operations for each entrypoint', () => {
        let index = 0;
        schemaService.entrypoints$
          .filter(entrypoints => 0 < entrypoints.length)
          .subscribe(entrypoints => {
            if(2 === ++index) {
              expect(entrypoints.length).toBe(2);
              expect(entrypoints[0] instanceof EntryPoint).toBeTruthy();
              expect(entrypoints[0].operations).toContain('GET');
              expect(entrypoints[0].operations).not.toContain('POST');
              expect(entrypoints[1] instanceof EntryPoint).toBeTruthy();
              expect(entrypoints[1].operations).toContain('GET');
              expect(entrypoints[1].operations).toContain('POST');
            }
          });

        let observable = new BehaviorSubject({
          '@id': '#Entrypoint',
          'hydra:supportedProperty': [
            {
              'hydra:property': {
                '@id': '#Entrypoint/person',
                'hydra:supportedOperation': [{'hydra:method': 'GET'}]
              }
            },
            {
              'hydra:property': {
                '@id': '#Entrypoint/BlogPosting',
                'hydra:supportedOperation': [{'hydra:method': 'GET'}, {'hydra:method': 'POST'}]
              }
            }
          ]
        });
        schemaService._loadCollectionOperations(observable);
      });

    });

    describe('~_loadSingleOperations', () => {

      it('should load single operations for each entrypoint', () => {
        schemaService.entrypoints$
          .filter(entrypoints => 0 < entrypoints.length)
          .subscribe(entrypoints => {
            expect(entrypoints.length).toBe(1);
            expect(entrypoints[0] instanceof EntryPoint).toBeTruthy();
            expect(entrypoints[0].operations).toContain('GET');
            expect(entrypoints[0].operations).toContain('POST');
            expect(entrypoints[0].operations).toContain('DELETE');
          });

        let observable = new BehaviorSubject({
          'hydra:title': 'Person',
          'hydra:supportedOperation': [{ 'hydra:method': 'GET'}, { 'hydra:method': 'POST'}, { 'hydra:method': 'DELETE'}]
        });
        schemaService._loadSingleOperations(observable);
      });

    });

    describe('~_loadSchema', () => {

      it('should load title and models', () => {
        schemaService.schema$
          .filter(schema => null !== schema)
          .subscribe(schema => {
            expect(schema.title).toBeUndefined();
            expect(schema.models).toBeDefined();
            expect(Array.isArray(schema.models)).toBeTruthy();
          });

        let observable = new BehaviorSubject({});
        schemaService._loadSchema(observable);
      });

    });
  });
};
