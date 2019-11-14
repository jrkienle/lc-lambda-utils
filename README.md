> **DEPRECATED** This package has been deprecated, and will receive no further updates or support from Kienle Holdings.

# lc-lambda-utils

> Shared Utilities for Lightning CI Lambda Functions

## Prerequisites

* Node.js 8.x

## Installation

1. `npm install lc-lambda-utils` or `yarn add lc-lambda-utils`

## Usage

```typescript
import { fetch, handleFetchError, FetchError } from 'lc-lambda-utils';

// Warning: env variables SUMO_URL and SLACK_URL must be present before using fetch responses

const fetchSomething = async () => {
  const fetchResults = await fetch('foo' { method: 'POST' })
    .then((res) => {
      if (someCondition) {
        throw new FetchError('an error for developers', 500, 'an error for the end user');
      }
      // Do something additional with the response if you want
      return res;
    })
    .catch((err) => handleFetchError(err));
};
```

## Development

1. `yarn install`
2. `yarn run build`
