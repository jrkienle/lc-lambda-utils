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

declare function fetch(url: string, options?: RequestInit): Promise<any>;
declare function handleFetchSuccess(data: any, status: number, sumoProps?: any): LambdaResponse;
declare function handleFetchError(
  err: FetchError | any, lambdaName: string, sumoProps?: any): LambdaResponse;

export { fetch, handleFetchError, handleFetchSuccess, FetchError, LambdaResponse };
