import nodeFetch, { RequestInit } from 'node-fetch';
import { Logger as SumologicLogger } from 'sumologic-logger';
import { Logger as SlackLogger } from 'slack-webhook-logger';

export class FetchError extends Error {
  public clientError: string;
  public code: number;
  constructor(message: string, code?: number, clientError?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.clientError = clientError || 'An unknown error has occurred';
    this.code = code || 500;
  }
}

export const handleFetchError = (err: FetchError | any, lambdaName: string, sumoProps?: any) => {
  const sumologicLogger = new SumologicLogger(process.env.SUMO_URL as string);
  const slackLogger = new SlackLogger(process.env.SLACK_URL as string, false);

  if (!(err instanceof FetchError)) {
    // tslint:disable-next-line:no-parameter-reassignment
    err = new FetchError(err.message);
  }

  slackLogger.error({
    attachments: [{
      fallback: err.message,
      color: '#F44336',
      pretext: err.clientError,
      title: 'View Full Error Logs on Sumologic',
      title_link: 'https://service.sumologic.com/',
      text: err.message,
      fields: [{
        title: 'Code',
        value: err.code,
        short: false,
      }],
      footer: lambdaName,
      ts: new Date().getTime() / 1000,
    }],
  });

  sumologicLogger.error({
    code: err.code,
    message: err.clientError,
    innerError: err.message,
    ...sumoProps,
  });

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: err.clientError }),
    statusCode: err.code,
  };
};

const fetch = (url: string, options?: RequestInit) => nodeFetch(url, {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  ...options,
})
  .then(async (res) => {
    const resClone = res.clone();
    try {
      const body = await res.json();
      return { body, status: res.status };
    } catch (e) {
      const text = await resClone.text();
      throw new FetchError(text, resClone.status);
    }
  });

export default fetch;
