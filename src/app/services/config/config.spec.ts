import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from 'angular2/testing';
import {ConfigService} from './config';

export function main() {

  describe('Config service', () => {

    beforeEachProviders(() => {
      return [
        ConfigService
      ];
    });

    describe('~_hookMeIfYouCan', () => {

      it('should be hookable with available values',
        inject([ConfigService], (configService) => {
          let defaultConfig = {
            api: {
              url: 'http://localhost:8000'
            },
            nonAvailableHook: 'foo'
          };

          configService._hookMeIfYouCan(defaultConfig);
          expect(configService.api.url).toBe('http://localhost:8000');
          expect(configService['nonAvailableHook']).toBeUndefined();
        })
      );

    });
  });
};
