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
import {ConfigService} from '../config/config';
import {SchemaService} from './schema';
import {Model} from '../models/Model';

export function main() {

    describe('Schema service', () => {
        let defaultResponse: any;

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

        it('should ask API for schema',
            inject([SchemaService, ConfigService, MockBackend], fakeAsync((schemaService, configService, mockBackend) => {
                mockBackend.connections.subscribe(c => {
                    expect(c.request.url).toBe('http://localhost:8000/apidoc');
                    let response = new ResponseOptions({
                        body: defaultResponse
                    });
                    c.mockRespond(new Response(response));
                });

                spyOn(schemaService, '_updateSchemaObserver');
                schemaService.getSchema();
                tick();
                expect(schemaService._updateSchemaObserver).toHaveBeenCalled();
                expect(schemaService._updateSchemaObserver).toHaveBeenCalledWith(defaultResponse);
            }))
        );

        it('should update observer',
            inject([SchemaService], (schemaService) => {
                spyOn(schemaService, '_getSchemaTitle');
                spyOn(schemaService, '_populateModels');

                schemaService._updateSchemaObserver(defaultResponse);

                expect(schemaService._getSchemaTitle).toHaveBeenCalled();
                expect(schemaService._getSchemaTitle).toHaveBeenCalledWith(defaultResponse);
                expect(schemaService._populateModels).toHaveBeenCalled();
                expect(schemaService._populateModels).toHaveBeenCalledWith(defaultResponse);
            })
        );

        it('should get title',
            inject([SchemaService], (schemaService) => {
                let title: string = schemaService._getSchemaTitle(defaultResponse);
                expect(title).toEqual('Hydra API Test');
            })
        );

        it('should populate the models',
            inject([SchemaService], (schemaService) => {
                let fullModels: Array<string> = [
                        'Person',
                        'Organization',
                        'The API entrypoint',
                        'A constraint violation',
                        'A constraint violation list'
                    ],
                    schema: any = defaultResponse = {
                        'hydra:supportedClass': fullModels
                    };

                spyOn(schemaService, '_cleanModelsList')
                    .and.returnValue(['Person', 'Organization']);

                spyOn(schemaService, '_populateModel')
                    .and.returnValue(['Person', 'Organization']);

                schemaService._populateModels(schema);

                expect(schemaService._cleanModelsList).toHaveBeenCalled();
                expect(schemaService._cleanModelsList).toHaveBeenCalledWith(fullModels);

                expect(schemaService._populateModel).toHaveBeenCalled();
                expect(schemaService._populateModel.calls.count()).toEqual(2);
            })
        );

        it('should clean the list of model from polluted datas',
            inject([SchemaService], (schemaService) => {
                let models: Array<string> = [
                        'Person',
                        'Organization',
                        'The API entrypoint',
                        'A constraint violation',
                        'A constraint violation list'
                    ];

                let cleanedModels = schemaService._cleanModelsList(models);

                expect(cleanedModels).toEqual(['Person', 'Organization']);
            })
        );

        it('should populate model',
            inject([SchemaService], (schemaService) => {
                let schemaModel = { 'hydra:title': 'Person'},
                    model = schemaService._populateModel(schemaModel);

                expect(model).toBeAnInstanceOf(Model);
            })
        );
    });
};
