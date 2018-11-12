import nock from 'nock';
import * as sumoLogger from 'sumologic-logger';
import * as slackLogger from 'slack-webhook-logger';

import fetch, { handleFetchError, handleFetchSuccess, FetchError } from './fetch';

describe('fetch.ts', () => {
  describe('FetchError', () => {
    test('should return a 500 error by default', () => {
      const error = new FetchError('foo');

      expect(error.clientError).toBe('An unknown error has occurred');
      expect(error.code).toBe(500);
      expect(error.message).toBe('foo');
    });
  });

  describe('handleFetchSuccess', () => {
    let sumoLoggerSpy: jest.SpyInstance;

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    beforeEach(() => {
      sumoLoggerSpy = jest.spyOn(sumoLogger, 'Logger');
      sumoLoggerSpy.mockImplementation(() => mockLogger);
    });

    afterEach(() => {
      sumoLoggerSpy.mockRestore();
      mockLogger.error.mockRestore();
      mockLogger.info.mockRestore();
      mockLogger.warn.mockRestore();
    });

    test('should return a given body and status code', async () => {
      const res = handleFetchSuccess({ foo: 'bar' }, 201);

      expect(JSON.parse(res.body).data.foo).toBe('bar');
      expect(res.statusCode).toBe(201);
      expect(mockLogger.error).toBeCalledTimes(0);
      expect(mockLogger.info).toBeCalledTimes(1);
      expect(mockLogger.warn).toBeCalledTimes(0);
    });
  });

  describe('handleFetchError', () => {
    let slackLoggerSpy: jest.SpyInstance;
    let sumoLoggerSpy: jest.SpyInstance;

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    beforeEach(() => {
      slackLoggerSpy = jest.spyOn(slackLogger, 'Logger');
      slackLoggerSpy.mockImplementation(() => mockLogger);

      sumoLoggerSpy = jest.spyOn(sumoLogger, 'Logger');
      sumoLoggerSpy.mockImplementation(() => mockLogger);
    });

    afterEach(() => {
      slackLoggerSpy.mockRestore();
      sumoLoggerSpy.mockRestore();
      mockLogger.error.mockRestore();
      mockLogger.info.mockRestore();
      mockLogger.warn.mockRestore();
    });

    test('should return a 500 by default if provided error is not a FetchError', async () => {
      const res = handleFetchError(new Error('foo'), 'bar');

      expect(JSON.parse(res.body).message).toBe('An unknown error has occurred');
      expect(res.statusCode).toBe(500);
      expect(mockLogger.error).toBeCalledTimes(2);
      expect(mockLogger.info).toBeCalledTimes(0);
      expect(mockLogger.warn).toBeCalledTimes(0);
    });

    test('should return a given FetchError and client error', async () => {
      const res = handleFetchError(new FetchError('foo', 404, 'Not found'), 'bar');

      expect(JSON.parse(res.body).message).toBe('Not found');
      expect(res.statusCode).toBe(404);
      expect(mockLogger.error).toBeCalledTimes(2);
      expect(mockLogger.info).toBeCalledTimes(0);
      expect(mockLogger.warn).toBeCalledTimes(0);
    });
  });

  describe('fetch', () => {
    test('should return response.json() if fetch return a 200-300 level response', async () => {
      nock('http://foo.com')
        .get('/bar')
        .reply(200, { foo: 'bar' });

      const fetchResults = await fetch('http://foo.com/bar');

      expect(fetchResults.foo).toBe('bar');
    });

    test('should throw a FetchError if response code is less than 200 or 400+', async () => {
      nock('http://foo.com')
        .get('/bar')
        .reply(400, { foo: 'bar' });

      const fetchResults = await fetch('http://foo.com/bar')
      .catch(err => err);

      expect(fetchResults instanceof FetchError).toBe(true);
    });
  });
});
