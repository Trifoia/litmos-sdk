'use strict';

const assert = require('assert');

const config = require('../../config.js');

const processOpts = require('../../lib/request/process-opts.js');

describe('process-opts', function() {
  it('should process opts for a GET request', async () => {
    const context = {
      _endpoint: ['endpoint1', 'endpoint2', 'endpoint3'],
      _resPath: ['resPath1', 'resPath2'],
      _request: {
        opts: config.litmosOpts
      }
    };

    const actual = processOpts(context, 'GET');
    assert.strictEqual(actual.method, 'GET');
    assert.strictEqual(actual.url, 'https://api.litmos.com/v1.svc/endpoint1/endpoint2/endpoint3?source=sdkTesting');
    assert.strictEqual(actual.headers['Content-Type'], 'application/xml');
    assert.strictEqual(actual.headers.apikey, config.litmosOpts.apiKey);
    assert.strictEqual(actual.timeout, config.litmosOpts.timeout);
  });

  it('should process opts for a DELETE request', async () => {
    const context = {
      _endpoint: ['endpoint1', 'endpoint2', 'endpoint3'],
      _resPath: ['resPath1', 'resPath2'],
      _request: {
        opts: config.litmosOpts
      }
    };

    const actual = processOpts(context, 'DELETE');
    assert.strictEqual(actual.method, 'DELETE');
    assert.strictEqual(actual.url, 'https://api.litmos.com/v1.svc/endpoint1/endpoint2/endpoint3?source=sdkTesting');
    assert.strictEqual(actual.headers['Content-Type'], 'application/xml');
    assert.strictEqual(actual.headers.apikey, config.litmosOpts.apiKey);
    assert.strictEqual(actual.timeout, config.litmosOpts.timeout);
  });

  it('should error when processing PUT or POST with no body', async () => {
    assert.throws(() => processOpts({}, 'PUT'));
    assert.throws(() => processOpts({}, 'POST'));
  });

  it('should process opts for a POST request', async () => {
    const context = {
      _endpoint: ['endpoint1', 'endpoint2', 'endpoint3'],
      _resPath: ['resPath1', 'resPath2'],
      _reqPath: ['reqPath1'],
      _request: {
        opts: config.litmosOpts
      }
    };

    const actual = processOpts(context, 'POST', { TestBody: 'test' });
    assert.strictEqual(actual.method, 'POST');
    assert.strictEqual(actual.url, 'https://api.litmos.com/v1.svc/endpoint1/endpoint2/endpoint3?source=sdkTesting');
    assert.strictEqual(actual.headers['Content-Type'], 'application/xml');
    assert.strictEqual(actual.headers.apikey, config.litmosOpts.apiKey);
    assert.strictEqual(actual.data, '<reqPath1><TestBody>test</TestBody></reqPath1>');
    assert.strictEqual(actual.timeout, config.litmosOpts.timeout);
  });

  it('should process opts for a PUT request', async () => {
    const context = {
      _endpoint: ['endpoint1', 'endpoint2', 'endpoint3'],
      _resPath: ['resPath1', 'resPath2'],
      _reqPath: ['reqPath1'],
      _request: {
        opts: config.litmosOpts
      }
    };

    const actual = processOpts(context, 'PUT', { TestBody: 'test' });
    assert.strictEqual(actual.method, 'PUT');
    assert.strictEqual(actual.url, 'https://api.litmos.com/v1.svc/endpoint1/endpoint2/endpoint3?source=sdkTesting');
    assert.strictEqual(actual.headers['Content-Type'], 'application/xml');
    assert.strictEqual(actual.headers.apikey, config.litmosOpts.apiKey);
    assert.strictEqual(actual.data, '<reqPath1><TestBody>test</TestBody></reqPath1>');
    assert.strictEqual(actual.timeout, config.litmosOpts.timeout);
  });
});
