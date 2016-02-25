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
import {ModelService} from './models';
import {ConfigService} from '../config/config';

export function main() {

    describe('Model service', () => {
        let defaultResponse: any;

        beforeEachProviders(() => {
            return [
                BaseRequestOptions,
                MockBackend,
                ModelService,
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
                '@context': {},
                '@id': '/apidoc',
                'hydra:title': 'Hydra API Test',
                'hydra:supportedClass': [
                    {
                        '@id': 'http://schema.org/Person',
                        '@type': 'hydra:Class',
                        'rdfs:label': 'Person',
                        'hydra:title': 'Person',
                        'hydra:description': 'A person (alive, dead, undead, or fictional).',
                        'hydra:supportedProperty': [
                            {
                                '@type': 'hydra:SupportedProperty',
                                'hydra:property': {
                                    '@id': '#Person/id',
                                    '@type': 'rdf:Property',
                                    'rdfs:label': 'id',
                                    'domain': 'http://schema.org/Person',
                                    'range': 'xmls:integer'
                                },
                                'hydra:title': 'id',
                                'hydra:required': false,
                                'hydra:readable': false,
                                'hydra:writable': true
                            },
                            {
                                '@type': 'hydra:SupportedProperty',
                                'hydra:property': {
                                    '@id': 'https://schema.org/familyName',
                                    '@type': 'rdf:Property',
                                    'rdfs:label': 'familyName',
                                    'domain': 'http://schema.org/Person',
                                    'range': 'xmls:string'
                                },
                                'hydra:title': 'familyName',
                                'hydra:required': false,
                                'hydra:readable': true,
                                'hydra:writable': true,
                                'hydra:description': 'Family name. In the U.S., the last name of an Person.'
                            }
                        ],
                        'hydra:supportedOperation': [
                            {
                                '@type': 'hydra:Operation',
                                'hydra:method': 'GET',
                                'hydra:title': 'Retrieves Person resource.',
                                'rdfs:label': 'Retrieves Person resource.',
                                'returns': 'http://schema.org/Person'
                            },
                            {
                                '@type': 'hydra:ReplaceResourceOperation',
                                'expects': 'http://schema.org/Person',
                                'hydra:method': 'PUT',
                                'hydra:title': 'Replaces the Person resource.',
                                'rdfs:label': 'Replaces the Person resource.',
                                'returns': 'http://schema.org/Person'
                            },
                            {
                                '@type': 'hydra:Operation',
                                'hydra:method': 'DELETE',
                                'hydra:title': 'Deletes the Person resource.',
                                'rdfs:label': 'Deletes the Person resource.',
                                'returns': 'owl:Nothing'
                            }
                        ]
                    }
                ]
            };
        });

        it('should ask API for models',
            inject([ModelService, ConfigService, MockBackend], fakeAsync((modelService, configService, mockBackend) => {
                mockBackend.connections.subscribe(c => {
                    expect(c.request.url).toBe('http://localhost:8000/apidoc');
                    let response = new ResponseOptions({
                        body: defaultResponse
                    });
                    c.mockRespond(new Response(response));
                });

                spyOn(modelService, '_filterEntryPoints');

                modelService.getEntryPoints();
                tick();
                expect(modelService._filterEntryPoints).toHaveBeenCalled();
                expect(modelService._filterEntryPoints).toHaveBeenCalledWith(defaultResponse, 0);
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
