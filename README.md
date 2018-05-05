# flow-logger
> A logger with a horrible name

This is a logger that is used for creating prod-ready message and performance logs for an app consisting of microservices. It outputs logs in a way that allows for easy graylog parsing using [extractors](http://docs.graylog.org/en/2.4/pages/extractors.html)

# Instantiation:

```
npm i --save flow-logger
```

# Usage:

```js
const Logger = require('flow-logger');
const logger = new Logger({ name: 'microservice-1',  persistentId: message.flowId, version: '1.2.3'});
logger.message('Hi!');
...
logger.message(Buffer.from('1'));
...
const e = new Error('bla');
e.stack = 'at Bla';
logger.error(e);
...
logger.toString();

{
  "name": "microservice-1",
  "persistentId": "f64f2940",
  "messages": {
    "1970-01-01T00:00:00.000Z": "Hi!",
    "1970-01-01T00:00:01.000Z": "MQ=="
  },
  "errored": true,
  "error": { "stack": "at Bla", "message": "bla" },
  "erroredAt": "1970-01-01T00:00:02.000Z"
}
```
