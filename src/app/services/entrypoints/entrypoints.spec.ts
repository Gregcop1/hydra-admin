import { it,
    describe,
    expect,
    inject,
    fakeAsync,
    beforeEachProviders,
    beforeEach,
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
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
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
                mockBackend.connections.subscribe(c => {
                    expect(c.request.url).toBe('http://localhost:8000');
                    let response = new ResponseOptions({
                        body: defaultResponse
                    });
                    c.mockRespond(new Response(response));
                });

                spyOn(entrypointService, '_filterEntryPoints');

                entrypointService.getEntryPoints();
                tick();
                expect(entrypointService._filterEntryPoints).toHaveBeenCalled();
                expect(entrypointService._filterEntryPoints).toHaveBeenCalledWith(defaultResponse, 0);
            }))
        );

        it('should filter entrypoints',
            inject([EntrypointService], (entrypointService) => {
                let filteredResults = entrypointService._filterEntryPoints(defaultResponse);
                expect(filteredResults['@context']).toBeUndefined();
                expect(filteredResults['@id']).toBeUndefined();
                expect(filteredResults['@type']).toBeUndefined();
                expect(filteredResults['person']).toEqual('/people');
            })
        );
    });
};
