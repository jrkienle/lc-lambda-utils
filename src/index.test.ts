import * as lcLambdaUtils from './index';

describe('index.ts', () => {
  test('should export fetch and fetch error handler', () => {
    expect(lcLambdaUtils).toHaveProperty('fetch');
    expect(lcLambdaUtils).toHaveProperty('handleFetchError');
  });
});
