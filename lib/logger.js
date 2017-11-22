const decircuralize = require('circular-json').stringify;

const replace = (key, value) => {
  if (value instanceof Error) {
    const error = {};
    Object.getOwnPropertyNames(value).forEach((k) => {
      error[k] = value[k];
    });
    return error;
  }
  if (value && value.type === 'Buffer') {
    return Buffer.from(value.data).toString('base64');
  }
  return value;
};

const clean = json => {
  return decircuralize(json, replace, null, true);
};

class Logger {
  constructor(name) {
    this.name = name;
  }
  timed(what, comment) {
    this[what] = {
      comment,
      startedAt: Date.now(),

    };
    this[what].end = function () {
      this.endedAt = Date.now();
      this.duration = +this.endedAt - this.startedAt;
    }
  }
  error(e) {
    this.errored = true;
    this.error = e;
    this.erroredAt = Date.now();
  }
  message(name, comment) {
    this[name] = {
      comment,
      time: Date.now(),
    };
  }
};

Logger.prototype.toString = function () {
  return clean(this);
};

module.exports = Logger;
