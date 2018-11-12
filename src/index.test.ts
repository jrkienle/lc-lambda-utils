import * as lcLambdaUtils from './index';

describe('index.ts', () => {
  test('should export fetch and fetch handlers', () => {
    expect(lcLambdaUtils).toHaveProperty('fetch');
    expect(lcLambdaUtils).toHaveProperty('handleFetchError');
    expect(lcLambdaUtils).toHaveProperty('handleFetchSuccess');
  });
});
