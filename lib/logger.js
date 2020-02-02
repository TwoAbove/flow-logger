const moment = require("moment");
const decircuralize = require("circular-json").stringify;

const replace = (key, value) => {
  if (value instanceof moment) {
    return value.toISOString();
  }
  if (value instanceof Error) {
    const error = {};
    Object.getOwnPropertyNames(value).forEach(k => {
      error[k] = value[k];
    });
    return error;
  }
  if (value && value.type === "Buffer") {
    return Buffer.from(value.data).toString("base64");
  }
  return value;
};

const clean = json => decircuralize(json, replace, null, true);

class Logger {
  constructor({name, persistentId, version} = {}) {
    this.name = name;
    this.persistentId = persistentId;
    this.version = version;
  }

  get now() {
    return moment();
  }

  timed(what, comment, duplicate = 1) {
    const name = `${what}-${duplicate}`;
    if (this[name]) {
      return timed(what, comment, duplicate + 1);
    }
    this[what] = {
      comment,
      startedAt: this.now
    };
    const end = () => {
      this[what].endedAt = this.now;
      this[what].duration = this[what].endedAt - this[what].startedAt;
    };
    return end;
  }

  error(e) {
    this.errored = true;
    this.error = e;
    this.erroredAt = this.now;
  }

  message(...comments) {
    if (!this.messages) {
      this.messages = {};
    }
    this.messages[this.now.toISOString()] = comments.length > 1
      ? comments
      : comments[0];
  }

  log() {
    // eslint-disable-next-line no-console
    console.log(this.toString());
  }
}

Logger.prototype.toString = function toString() {
  return clean(this);
};

module.exports = Logger;
