import { Response, RequestInit } from 'node-fetch';

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

declare function fetch(url: string, options?: RequestInit): Promise<Response>;
declare function handleFetchSuccess(data: any, status: number, additionalSuccessProps?: any): LambdaResponse;
declare function handleFetchError(err: FetchError | any, additionalErrorProps?: any): LambdaResponse;

export { fetch };
