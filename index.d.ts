import { RequestInit } from 'node-fetch';

interface LambdaResponse {
  headers: {
    'Access-Control-Allow-Origin': '*';
  };
  body: string;
  statusCode: number;
}

declare class FetchError extends Error {
  public clientError: string;
  public code: number;
  constructor(data: any, status: number, additionalSuccessProps?: any);
}

declare function fetch(url: string, options?: RequestInit): Promise<{ body: any, status: number }>;
declare function handleFetchError(
  err: FetchError | any, lambdaName: string, sumoProps?: any): LambdaResponse;

export { fetch, handleFetchError, FetchError, LambdaResponse };
