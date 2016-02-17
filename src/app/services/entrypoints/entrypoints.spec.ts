import { it,
    describe,
    expect,
    inject,
    fakeAsync,
    beforeEachProviders,
    tick,
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
import {EntrypointService} from './entrypoints';
import {ConfigService} from '../config/config';

export function main() {

    describe('Entrypoints service', () => {
        let defaultResponse: any;

        beforeEachProviders(() => {
            return [
                BaseRequestOptions,
                MockBackend,
                EntrypointService,
                provide(ConfigService, {
                    useValue: {
                        api: {
                            url: 'http://localhost:8000'
                        }
                    }
                }),
                provide(Http, {
                    useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }, deps: [MockBackend, BaseRequestOptions]
                })
            ];
        });

        beforeEach(() => {
            defaultResponse = {
                '@context': '/contexts/Entrypoint',
                '@id': '/',
                '@type': 'Entrypoint',
                'person': '/people'
            };
        });

        it('should ask API for entrypoints',
            inject([EntrypointService, ConfigService, MockBackend], fakeAsync((entrypointService, configService, mockBackend) => {
                let res;
                mockBackend.connections.subscribe(c => {
                    expect(c.request.url).toBe('http://localhost:8000');
                    let response = new ResponseOptions({
                        body: defaultResponse
                    });
                    c.mockRespond(new Response(response));
                });

                spyOn(entrypointService, '_getEntryPointsList');

                // two calls to check the "singleton like" Observable
                entrypointService.getEntryPoints().subscribe(_res => res = _res);
                tick();
                expect(entrypointService._getEntryPointsList).toHaveBeenCalledWith(defaultResponse);
            }))
        );

        it('should filter entrypoints',
            inject([EntrypointService], (entrypointService) => {
                let filteredResults = entrypointService._getEntryPointsList(defaultResponse);
                expect(filteredResults['@context']).toBeUndefined();
                expect(filteredResults['@id']).toBeUndefined();
                expect(filteredResults['@type']).toBeUndefined();
                expect(filteredResults['person']).toEqual('/people');
            })
        );
    });
};
