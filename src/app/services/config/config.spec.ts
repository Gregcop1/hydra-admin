import { it,
    describe,
    expect,
    inject,
    beforeEachProviders
} from 'angular2/testing';
import {ConfigService} from './config';

export function main() {

    describe('Config service', () => {
        let defaultConfig: any;

        beforeEachProviders(() => {
            return [
                ConfigService
            ];
        });

        beforeEach(() => {
            defaultConfig = {
                api: {
                    url: 'http://localhost:8000'
                },
                nonAvailableHook: 'foo'
            };
        });

        it('should be hookable with available values',
            inject([ConfigService], (configService) => {
                configService._hookMeIfYouCan(defaultConfig);
                expect(configService.api.url).toEqual('http://localhost:8000');
                expect(configService['nonAvailableHook']).toBeUndefined();
            })
        );
    });
};
